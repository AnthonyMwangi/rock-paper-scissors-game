// Import the functions you need from the SDKs you need
import { useGlobalStore } from "@/store";
import { getPlayerOutcome } from "@/utilities/utilities.base";
import { GameOption, GameResult } from "@/utilities/utilities.types";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
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
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export class Firebase {
  private static db = getFirestore(firebaseApp);
  private static auth = getAuth(firebaseApp);

  private static db_collection = () => {
    return collection(this.db, "rps_results");
  };

  /**
   * Authenticate user anonymously
   * - All users are assigned a guest session
   */
  static signIn = () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, async (user) => {
        let authUser = user;

        // If there's no user info, sign-in
        if (!authUser?.uid) {
          await signInAnonymously(this.auth)
            .then((cred) => {
              authUser = cred.user;
            })
            .catch(reject);
        }

        // Update global store
        if (
          authUser?.uid &&
          authUser?.uid !== useGlobalStore.getState().app.player?.uid
        ) {
          useGlobalStore.getState().setPlayerInfo({
            uid: authUser.uid,
            displayName: authUser.displayName,
            isAnonymous: authUser.isAnonymous,
          });
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
    const uid = useGlobalStore.getState().app.player?.uid;
    const q = query(this.db_collection(), where("playerId", "==", uid));

    const data = (await getDocs(q)).docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as unknown as GameResult[];

    useGlobalStore.getState().setPlayerResults(data);

    return data;
  };
}
