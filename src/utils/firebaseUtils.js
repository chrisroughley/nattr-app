import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from "@firebase/firestore";

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
    console.log("CREATE USER ERROR: ", err.message);
    return { error: err.message };
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
    console.log("EMAIL SIGN IN ERROR: ", err.message);
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
    return { error: err.message };
  }
};

export const acceptFriendRequest = async (
  recipientUserId,
  requesterUserId,
  recipientDisplayName,
  requesterDisplayName
) => {
  try {
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
  } catch (err) {
    console.log("ACCEPT FRIEND REQUEST ERROR: ", err.message);
  }
};

export const rejectFriendRequest = async (recipientUserId, requesterUserId) => {
  try {
    const pendingFriendRequestRef = doc(
      db,
      "users",
      recipientUserId,
      "pendingFriendRequests",
      requesterUserId
    );
    //remove the pending friend request document
    await deleteDoc(pendingFriendRequestRef);
  } catch (err) {
    console.log("REJECT FRIEND REQUEST ERROR: ", err.message);
  }
};

export const sendFriendRequest = async (
  currentUserId,
  targetUserId,
  currentUserDisplayName
) => {
  try {
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
  } catch (err) {
    console.log("SEND FRIEND REQUEST ERROR: ", err.message);
  }
};

export const initializeChat = async (members, chatType) => {
  try {
    const chatsRef = collection(db, "chats");
    const docRef = await addDoc(chatsRef, { chatType });
    members.forEach(async (member) => {
      //create a new chat document with a members collection
      const memberRef = doc(db, "chats", docRef.id, "members", member.userId);
      await setDoc(memberRef, {
        userId: member.userId,
        displayName: member.displayName,
      });
      //add the new chat id to the all members chats list's
      const chatsListRef = doc(
        db,
        "users",
        member.userId,
        "chatsList",
        docRef.id
      );
      await setDoc(chatsListRef, { chatId: docRef.id });
    });
    //if chat is just between two friends adds the chat id to the friend document on each users friends list collection
    if (chatType === "friend") {
      const userOneFriendRef = doc(
        db,
        "users",
        members[0].userId,
        "friendsList",
        members[1].userId
      );
      const userTwoFriendRef = doc(
        db,
        "users",
        members[1].userId,
        "friendsList",
        members[0].userId
      );
      await setDoc(userOneFriendRef, { chatId: docRef.id }, { merge: true });
      await setDoc(userTwoFriendRef, { chatId: docRef.id }, { merge: true });
    }
  } catch (err) {
    console.log("INITIALIZE CHAT ERROR: ", err.message);
  }
};

export const sendMessage = async (chatId, displayName, userId, message) => {
  try {
    //add message to chat's message collection
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      displayName,
      userId,
      message,
      messageDate: serverTimestamp(),
    });
    //update each members chat list to the latest sent message
    const membersRef = collection(db, "chats", chatId, "members");
    const members = await getDocs(membersRef);
    members.docs.forEach(async (member) => {
      const memberData = member.data();
      const userChatRef = doc(
        db,
        "users",
        memberData.userId,
        "chatsList",
        chatId
      );
      await setDoc(userChatRef, {
        chatId,
        displayName,
        message,
        messageDate: serverTimestamp(),
      });
    });
  } catch (err) {
    console.log("SEND MESSAGE ERROR: ", err.message);
  }
};
