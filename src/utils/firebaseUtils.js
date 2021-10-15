import { createUserWithEmailAndPassword } from "firebase/auth";

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
