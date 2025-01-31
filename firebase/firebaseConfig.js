import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAA_bssLlKlVz4io8NeVuhJxE3-eC3e_WY",
  authDomain: "kalendarz-bf12a.firebaseapp.com",
  projectId: "kalendarz-bf12a",
  storageBucket: "kalendarz-bf12a.firebasestorage.app",
  messagingSenderId: "108503353677",
  appId: "1:108503353677:web:50a54fbdfcd5a4b7d4cf04",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
