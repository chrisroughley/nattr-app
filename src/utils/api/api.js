import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";

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
    throw new Error(err.message);
    const errorCode = err.code;
    const errorMessage = err.message;
    console.log("ERROR: ", errorMessage);
  }
};
