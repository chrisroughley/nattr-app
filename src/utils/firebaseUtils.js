import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "@firebase/firestore";

export const createUser = async (displayName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      displayName,
      email,
    });
    return user.uid;
  } catch (err) {
    const errorMessage = err.message;
    console.log("ERROR: ", errorMessage);
    return { error: errorMessage };
  }
};

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("USER SIGNED IN: ", user);
    return user.uid;
  } catch (err) {
    console.log("SIGN IN ERROR: ", err.message);
    return { error: err.message };
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("GOOGLE SIGN IN USER: ", user);
    //check if a user currently exists
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // if sign in is from a new user create a new doc in users collection
      await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
      });
    }
    return user.uid;
  } catch (err) {
    console.log("GOOGLE SIGN IN ERROR: ", err.message);
  }
};

export const signInWithFaceBook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("FACEBOOK SIGN IN USER: ", user);
    //check if a user currently exists
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // if sign in is from a new user create a new doc in users collection
      await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
      });
    }
    return user.uid;
  } catch (err) {
    console.log("FACEBOOK SIGN IN ERROR: ", err.message);
  }
};

const addUserToFirestore = async () => {};
