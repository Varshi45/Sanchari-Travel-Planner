import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  setDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHcr6r2V5UFNv-z2WoDgsnvMHggEwPVNY",
  authDomain: "sanchari-1dfbe.firebaseapp.com",
  projectId: "sanchari-1dfbe",
  storageBucket: "sanchari-1dfbe.appspot.com",
  messagingSenderId: "502284666426",
  appId: "1:502284666426:web:811e067cd8b53dfb451703",
  measurementId: "G-1CP2H6RLWJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);

export const signUp = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(firestore, "users", user.uid), {
      email: user.email,
      username: username,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    return user ? user : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUsernameByEmail = async (email) => {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().username;
    } else {
      throw new Error("No user found with the provided email.");
    }
  } catch (error) {
    throw error;
  }
};
