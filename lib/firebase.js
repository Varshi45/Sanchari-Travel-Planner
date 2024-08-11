//lib\firebase.js

import { initializeApp } from "firebase/app";
import { updateDoc, arrayUnion } from "firebase/firestore";
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
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const storage = getStorage(app);

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

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser;
    if (user) {
      resolve(user);
    } else {
      reject(new Error("No user is currently logged in"));
    }
  });
};

export const getUserDetailsByEmail = async (email) => {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return {
        username: userData.username,
        photoURL: userData.photoURL,
      };
    } else {
      throw new Error("No user found with the provided email.");
    }
  } catch (error) {
    throw error;
  }
};

export const addTripToFavourites = async (userId, tripPlan) => {
  try {
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, {
      favourites: arrayUnion(tripPlan),
    });

    console.log("Trip added to favourites.");
  } catch (error) {
    throw new Error("Error adding trip to favourites: " + error.message);
  }
};

export const fetchFavoritedTrips = async (userId) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.favourites || [];
    } else {
      throw new Error("No user found with the provided ID.");
    }
  } catch (error) {
    throw error;
  }
};

export const uploadProfilePicture = async (userId, uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `profile_pictures/${userId}.jpg`);
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, { photoURL: downloadURL });
    return downloadURL;
  } catch (error) {
    throw error;
  }
};
