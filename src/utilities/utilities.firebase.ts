// Import the functions you need from the SDKs you need
import { useGlobalStore } from "@/store";
import { getPlayerOutcome } from "@/utilities/utilities.base";
import { toSnakeCase } from "@/utilities/utilities.snakeCase";
import {
  GameAnalytics,
  GameOption,
  GamePlayer,
  GameResult,
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
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
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

  private static db_collection = () => {
    return collection(this.db, "rps_results");
  };

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

    await updateProfile(this.auth.currentUser, {
      displayName: name,
    });

    this.trackEvent("RPS_PLAYER_NAME_UPDATED", {
      isFirstTime: !this.auth.currentUser.displayName,
      displayName: name,
    });

    useGlobalStore.getState().setPlayerInfo({
      uid: this.auth.currentUser.uid,
      isReturning: !!useGlobalStore.getState().app.player?.isReturning,
      isAnonymous: this.auth.currentUser.isAnonymous,
      displayName: name,
    });
  };

  /**
   * Authenticate user anonymously
   * - All users are assigned a guest session
   */
  static guestSignIn = () => {
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
        if (
          authUser?.uid &&
          authUser?.uid !== useGlobalStore.getState().app.player?.uid
        ) {
          useGlobalStore.getState().setPlayerInfo(authUser);
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

    await addDoc(this.db_collection(), {
      ...result,
      createdAt: serverTimestamp(),
    });

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
        this.db_collection(),
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
