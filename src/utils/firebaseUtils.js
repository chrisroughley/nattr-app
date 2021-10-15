import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, setDoc } from "@firebase/firestore";

export const createUser = async (displayName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(user);
    const docRef = await setDoc(doc(db, "users", user.uid), {
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
