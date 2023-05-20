
import { initializeApp } from "firebase/app";

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { collection } from "firebase/firestore";

const firebaseConfig = {
  /*SECRET CUTIE hehehe :) (>^ 3^)> */
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// COLLECTIONS
export const userRef = collection(db, 'userAssets');