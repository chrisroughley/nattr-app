import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

import { deleteDoc, serverTimestamp } from "@firebase/firestore";

import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "@firebase/firestore";

export const createUserWithEmail = async (displayName, email, password) => {
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

export const signInUserWithEmail = async (email, password) => {
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

export const signInWithSocial = async (authProvider) => {
  let provider = {};
  switch (authProvider) {
    case "google":
      provider = new GoogleAuthProvider();
      break;
    case "facebook":
      provider = new FacebookAuthProvider();
      break;
  }
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(`${authProvider.toUpperCase()} SIGN IN USER: `, user);
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
    console.log(`${authProvider.toUpperCase()} SIGN IN ERROR: `, err.message);
  }
};

export const acceptFriendRequest = async (
  recipientUserId,
  requesterUserId,
  recipientDisplayName,
  requesterDisplayName
) => {
  const recipientFriendsListRef = doc(
    db,
    "users",
    recipientUserId,
    "friendsList",
    requesterUserId
  );
  const requesterFriendsListRef = doc(
    db,
    "users",
    requesterUserId,
    "friendsList",
    recipientUserId
  );

  //set document in friends list collection to opposite users data and visa-versa
  await setDoc(
    recipientFriendsListRef,
    {
      userId: requesterUserId,
      displayName: requesterDisplayName,
      requestDate: serverTimestamp(),
    },
    { merge: true }
  );
  await setDoc(
    requesterFriendsListRef,
    {
      userId: recipientUserId,
      displayName: recipientDisplayName,
      requestDate: serverTimestamp(),
    },
    { merge: true }
  );

  const pendingFriendRequestRef = doc(
    db,
    "users",
    recipientUserId,
    "pendingFriendRequests",
    requesterUserId
  );

  //remove the pending friend request document
  await deleteDoc(pendingFriendRequestRef);
};

export const rejectFriendRequest = async (recipientUserId, requesterUserId) => {
  const pendingFriendRequestRef = doc(
    db,
    "users",
    recipientUserId,
    "pendingFriendRequests",
    requesterUserId
  );

  //remove the pending friend request document
  await deleteDoc(pendingFriendRequestRef);
};

export const sendFriendRequest = async (
  currentUserId,
  targetUserId,
  currentUserDisplayName
) => {
  const pendingFriendRequestRef = doc(
    db,
    "users",
    targetUserId,
    "pendingFriendRequests",
    currentUserId
  );
  await setDoc(
    pendingFriendRequestRef,
    {
      userId: currentUserId,
      displayName: currentUserDisplayName,
      requestDate: serverTimestamp(),
    },
    { merge: true }
  );
};
