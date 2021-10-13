import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "./firebase";
import { onAuthStateChanged } from "@firebase/auth";

export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(user);
  } catch (err) {
    const errorMessage = err.message;
    console.log("ERROR: ", errorMessage);
  }
};
