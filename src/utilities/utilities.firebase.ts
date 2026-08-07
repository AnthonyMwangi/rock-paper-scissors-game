// Import the functions you need from the SDKs you need
import { useGlobalStore } from "@/store";
import {
  getPlayerOutcome,
  parseLeaderboardEntry,
} from "@/utilities/utilities.base";
import {
  LEADERBOARD_FETCH_BUFFER,
  LEADERBOARD_MIN_GAMES_THRESHOLD,
  LEADERBOARD_SIZE,
} from "@/utilities/utilities.constants";
import { toSnakeCase } from "@/utilities/utilities.snakeCase";
import {
  GameAnalytics,
  GameMode,
  GameOption,
  GamePlayer,
  GameResult,
  LeaderboardEntry,
  Writable,
} from "@/utilities/utilities.types";
import {
  Analytics,
  getAnalytics,
  isSupported,
  logEvent,
  setUserId,
} from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseio.com`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export class Firebase {
  private static db = getFirestore(firebaseApp);
  private static auth = getAuth(firebaseApp);
  private static analytics: Analytics | undefined;

  private static results_db_name = "rps_results";
  private static leaderboard_db_name = "rps_leaderboard";

  private static initAnalytics = async () => {
    const isAnalyticsSupported = await isSupported();
    if (isAnalyticsSupported && import.meta.env.PROD) {
      this.analytics = getAnalytics(firebaseApp);
    }
  };

  /**
   * Update user display name
   */
  static updateUserName = async (name: string) => {
    if (!this.auth.currentUser) return;

    // Update auth profile
    await updateProfile(this.auth.currentUser, {
      displayName: name,
    });

    // Update leaderboard from anonymous
    await setDoc(
      doc(this.db, this.leaderboard_db_name, this.auth.currentUser.uid),
      { displayName: name },
      { merge: true },
    );

    this.trackEvent("RPS_PLAYER_NAME_UPDATED", {
      isFirstTime: !this.auth.currentUser.displayName,
      displayName: name,
    });

    useGlobalStore.getState().setPlayerInfo({
      player: {
        ...(useGlobalStore.getState().app.player || {}),
        displayName: name,
      } as GamePlayer,
      playerStats: useGlobalStore.getState().app.playerStats,
    });
  };

  /**
   * Authenticate user anonymously
   * - All users are assigned a guest session
   */
  static guestSignIn = async () => {
    this.initAnalytics();

    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, async (user) => {
        const authUser: Writable<GamePlayer> = {
          uid: user?.uid || "",
          displayName: user?.displayName || "",
          isAnonymous: !!user?.isAnonymous,
          isReturning: true,
        };

        // If there's no user info, sign-in
        if (!authUser?.uid) {
          await signInAnonymously(this.auth)
            .then((cred) => {
              authUser.uid = cred.user.uid || "";
              authUser.displayName = cred.user.displayName || "";
              authUser.isAnonymous = !!cred.user.isAnonymous;
              authUser.isReturning = false;
            })
            .catch(reject);
        }

        // Update global store
        if (authUser?.uid) {
          const [bonusStats] = await this.fetchLeaderboard(
            "bonus",
            authUser.uid,
          );
          const [standardStats] = await this.fetchLeaderboard(
            "standard",
            authUser.uid,
          );

          useGlobalStore.getState().setPlayerInfo({
            player: authUser,
            playerStats: {
              standard: standardStats,
              bonus: bonusStats,
            },
          });
        }

        // Track guest sign-ins
        if (this.analytics && authUser?.uid) {
          setUserId(this.analytics, authUser.uid);
          this.trackEvent("RPS_SESSION_START", authUser);
        }

        // Update history in the background
        this.getPlayerResults();

        resolve(authUser);
      });
    });
  };

  /**
   * Save the current player's choice & outcome
   */
  static savePlayerChoice = async (playerChoice: GameOption) => {
    const result = getPlayerOutcome(playerChoice);

    this.trackEvent("RPS_RESULT", result);

    await addDoc(collection(this.db, this.results_db_name), {
      ...result,
      createdAt: serverTimestamp(),
    });

    await this.updateLeaderboard(result);

    await this.getPlayerResults();

    return result;
  };

  /**
   * Fetch the current player's previous results
   */
  static getPlayerResults = async () => {
    const { player } = useGlobalStore.getState().app;

    if (player?.uid) {
      const q = query(
        collection(this.db, this.results_db_name),
        where("playerId", "==", player.uid),
      );

      const data = (await getDocs(q)).docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as unknown as GameResult[];

      useGlobalStore.getState().setPlayerResults(data);

      return data;
    }
  };

  static fetchLeaderboard = async (gameMode: GameMode, playerId?: string) => {
    if (playerId) {
      const playerEntry = await getDoc(
        doc(this.db, this.leaderboard_db_name, `${playerId}_${gameMode}`),
      ).then(
        (playerSnapshot) =>
          playerSnapshot.data() as LeaderboardEntry | undefined,
      );

      return playerEntry?.uid ? [parseLeaderboardEntry(playerEntry)!] : [];
    }

    const snapshot = await getDocs(
      query(
        collection(this.db, this.leaderboard_db_name),
        where("mode", "==", gameMode),
        orderBy("netScore", "desc"),
        limit(LEADERBOARD_FETCH_BUFFER),
      ),
    );

    return snapshot.docs
      .map((d) => parseLeaderboardEntry(d.data() as LeaderboardEntry)!)
      .filter(
        (entry) => (entry?.totalGames || 0) >= LEADERBOARD_MIN_GAMES_THRESHOLD,
      )
      .slice(0, LEADERBOARD_SIZE);
  };

  static updateLeaderboard = async (result: GameResult) => {
    if (!import.meta.env.PROD) return;
    if (!this.auth.currentUser) return;

    const doc_id = `${this.auth.currentUser.uid}_${result.mode}`;

    return await setDoc(
      doc(this.db, this.leaderboard_db_name, doc_id),
      {
        mode: result.mode,
        uid: this.auth.currentUser.uid,
        displayName: this.auth.currentUser.displayName ?? "Anonymous",
        wins: increment(result.outcome === "win" ? 1 : 0),
        losses: increment(result.outcome === "lose" ? 1 : 0),
        draws: increment(result.outcome === "draw" ? 1 : 0),
        netScore: increment(
          result.outcome === "win" ? 1 : result.outcome === "lose" ? -1 : 0,
        ),
        totalGames: increment(1),
        lastPlayedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  static migrateLeaderboard = async () => {
    const rawResultsSnapshot = await getDocs(
      collection(this.db, this.results_db_name),
    );

    const aggregates = new Map<string, LeaderboardEntry>();

    rawResultsSnapshot.docs.forEach((docSnap) => {
      const game = docSnap.data() as GameResult;

      if (game.playerId && game.mode) {
        const key = `${game.playerId}_${game.mode}`;

        const existing = aggregates.get(key) ?? {
          uid: game.playerId!,
          displayName: "Anonymous",
          mode: game.mode,
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          netScore: 0,
        };

        existing.totalGames += 1;
        if (game.outcome === "win") {
          existing.wins += 1;
          existing.netScore += 1;
        } else if (game.outcome === "lose") {
          existing.losses += 1;
          existing.netScore -= 1;
        } else {
          existing.draws += 1;
        }

        aggregates.set(key, existing);
      }
    });

    // Firestore batches cap at 500 writes — chunk if you have more entries
    const entries = Array.from(aggregates.values());
    const BATCH_LIMIT = 500;

    for (let i = 0; i < entries.length; i += BATCH_LIMIT) {
      const batch = writeBatch(this.db);
      const chunk = entries.slice(i, i + BATCH_LIMIT);

      chunk.forEach((entry) => {
        const leaderboardRef = doc(
          this.db,
          this.leaderboard_db_name,
          `${entry.uid}_${entry.mode}`,
        );
        batch.set(leaderboardRef, entry);
      });

      await batch.commit();
    }

    // eslint-disable-next-line no-console
    console.log(`Migrated ${entries.length} leaderboard entries.`);
  };

  static trackEvent = <K extends keyof GameAnalytics>(
    name: K,
    params: GameAnalytics[K],
  ) => {
    if (this.analytics) {
      return logEvent(
        this.analytics,
        name.toLowerCase(),
        toSnakeCase(params || undefined),
      );
    }
  };
}
