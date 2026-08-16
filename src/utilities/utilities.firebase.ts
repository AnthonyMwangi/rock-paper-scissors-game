// Import the functions you need from the SDKs you need
import { useGlobalStore } from "@/store";
import { parseLeaderboardEntry } from "@/utilities/utilities.prediction";
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
} from "firebase/firestore";
import {
  LEADERBOARD_FETCH_BUFFER,
  LEADERBOARD_MIN_GAMES_THRESHOLD,
  LEADERBOARD_SIZE,
  RESULTS_RECENT_LIMIT,
} from "./utilities.constants";
import { getPlayerOutcome } from "./utilities.gameplay";
import { objectKeysToSnakeCase } from "./utilities.parsers";
import {
  GameAnalytics,
  GameMode,
  GameOption,
  GamePlayer,
  GameResult,
  LeaderboardEntry,
  Writable,
} from "./utilities.types";

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
      ...(useGlobalStore.getState().app.player || {}),
      displayName: name,
    } as GamePlayer);
  };

  /**
   * Authenticate user anonymously
   * - All users are assigned a guest session
   */
  static guestSignIn = async () => {
    this.initAnalytics();

    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        async (user) => {
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
              .catch((e) => {
                unsubscribe();
                reject(e);
              });
          }

          // Update global store
          if (authUser?.uid) {
            await this.fetchLeaderboard("bonus", authUser.uid);
            await this.fetchLeaderboard("standard", authUser.uid);

            useGlobalStore.getState().setPlayerInfo(authUser);
          }

          // Track guest sign-ins
          if (this.analytics && authUser?.uid) {
            setUserId(this.analytics, authUser.uid);
            this.trackEvent("RPS_SESSION_START", authUser);
          }

          // Update history in the background
          this.fetchPlayerResults("standard");
          this.fetchPlayerResults("bonus");

          // Stop listening after first trigger
          unsubscribe();

          resolve(authUser);
        },
        (error) => {
          unsubscribe();
          reject(error);
        },
      );
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
      env: import.meta.env.MODE,
    });

    this.updateLeaderboard(result);
    this.fetchLeaderboard(result.mode, result.playerId!);
    this.fetchPlayerResults(result.mode);

    return result;
  };

  /**
   * Fetch the current player's previous results
   */
  static fetchPlayerResults = async (gameMode: GameMode) => {
    try {
      const { player } = useGlobalStore.getState().app;

      if (!player?.uid) {
        return { error: "Invalid player id", data: [] };
      }

      const q = query(
        collection(this.db, this.results_db_name),
        where("playerId", "==", player.uid),
        where("mode", "==", gameMode),
        orderBy("createdAt", "desc"),
        limit(RESULTS_RECENT_LIMIT),
      );

      const data = (await getDocs(q)).docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as unknown as GameResult[];

      useGlobalStore.getState().setPlayerResults(gameMode, data);

      return { error: undefined, data };
    } catch (e) {
      const errorMessage = (e as Error).message;
      // eslint-disable-next-line no-console
      console.error("RPS_FETCH_RESULTS", errorMessage);
      return { error: errorMessage, data: [] };
    }
  };

  static fetchLeaderboard = async (gameMode: GameMode, playerId?: string) => {
    try {
      if (playerId) {
        const playerEntry = await getDoc(
          doc(this.db, this.leaderboard_db_name, `${playerId}_${gameMode}`),
        ).then(
          (playerSnapshot) =>
            playerSnapshot.data() as LeaderboardEntry | undefined,
        );

        const parsedPlayerEntry = playerEntry?.uid
          ? parseLeaderboardEntry(playerEntry)
          : undefined;

        if (parsedPlayerEntry?.uid) {
          useGlobalStore.getState().setPlayerStats(gameMode, parsedPlayerEntry);
          return [parsedPlayerEntry];
        }

        return [];
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
        .filter((e) => (e?.totalGames || 0) >= LEADERBOARD_MIN_GAMES_THRESHOLD)
        .slice(0, LEADERBOARD_SIZE);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("RPS_FETCH_LEADERBOARD", (e as Error).message);
      return [];
    }
  };

  static updateLeaderboard = async (result: GameResult) => {
    try {
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
          env: import.meta.env.MODE,
        },
        { merge: true },
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("RPS_UPDATE_LEADERBOARD", (e as Error).message);
    }
  };

  static trackEvent = <K extends keyof GameAnalytics>(
    name: K,
    params: GameAnalytics[K],
  ) => {
    try {
      const parsedName = name.toLowerCase();
      const parsedParams = objectKeysToSnakeCase(params || {});

      if (!this.analytics) {
        // eslint-disable-next-line no-console
        return console.debug(parsedName, parsedParams);
      }

      return logEvent(this.analytics, parsedName, parsedParams);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("RPS_TRACK_EVENT", (e as Error).message);
    }
  };
}
