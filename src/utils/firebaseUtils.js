import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
} from "@firebase/firestore";

import { httpsCallable } from "@firebase/functions";

import { auth, db, functions } from "./firebase";

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
    default:
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
      await setDoc(
        userOneFriendRef,
        { chatId: docRef.id, messageDate: serverTimestamp() },
        { merge: true }
      );
      await setDoc(
        userTwoFriendRef,
        { chatId: docRef.id, messageDate: serverTimestamp() },
        { merge: true }
      );
    }
  } catch (err) {
    console.log("INITIALIZE CHAT ERROR: ", err.message);
  }
};

export const sendMessage = async (
  chatId,
  displayName,
  userId,
  message = "",
  media = {}
) => {
  try {
    const urlRegex =
      /(?:https?:\/\/)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

    let urlMetaData = {};
    const urlMatches = message.match(urlRegex);

    if (urlMatches && urlMatches.length === 1) {
      urlMetaData = { status: "pending" };
    }

    //add message to chat's message collection
    const messagesRef = collection(db, "chats", chatId, "messages");
    const docRef = await addDoc(messagesRef, {
      displayName,
      userId,
      message,
      messageDate: serverTimestamp(),
      media,
      urlMetaData,
    });

    //if a user posts a message containing a single url get the meta data for the url and add the object to the sent message
    if (urlMatches && urlMatches.length === 1) {
      const getMetaData = httpsCallable(functions, "getMetaData");
      getMetaData({
        url: urlMatches[0],
        chatId,
        messageId: docRef.id,
      });
    }

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
      setDoc(userChatRef, {
        chatId,
        displayName,
        message: message || `${displayName} sent a file`,
        messageDate: serverTimestamp(),
      });
    });

    return docRef.id;
  } catch (err) {
    console.log("SEND MESSAGE ERROR: ", err.message);
  }
};

export const getPendingFriendRequests = async (userId) => {
  try {
    const friendRequestsRef = collection(
      db,
      "users",
      userId,
      "pendingFriendRequests"
    );
    const querySnapshot = await getDocs(friendRequestsRef);
    console.log("QUERY SNAPSHOT: ", querySnapshot);
    const friendRequestsData = querySnapshot.docs.map((doc) => {
      return doc.data().userId;
    });
    return friendRequestsData;
  } catch (err) {
    console.log("GET FRIEND REQUESTS ERROR: ", err.message);
  }
};

export const getLatestChat = async (userId) => {
  const chatsListRef = collection(db, "users", userId || "noUser", "chatsList");
  const latestChatQuery = query(
    chatsListRef,
    orderBy("messageDate", "desc"),
    limit(1)
  );
  const querySnapshot = await getDocs(latestChatQuery);
  return querySnapshot;
};
export const getFriendsByUserId = async (userId) => {
  const friendsListRef = collection(db, "users", userId, "friendsList");
  const friendsListQuery = query(
    friendsListRef,
    orderBy("displayName", "asc"),
    limit(15)
  );
  const querySnapshot = await getDocs(friendsListQuery);

  const friendsList = querySnapshot.docs;

  const friendsListData = friendsList.map((friend) => {
    const friendData = friend.data();
    return {
      userId: friendData.userId,
      displayName: friendData.displayName,
      requestDate: friendData.requestDate.toString(),
      firebaseDoc: friend,
    };
  });
  console.log("FRIENDS LIST DATA: ", friendsListData);
  return friendsListData;
};

export const getMoreFriends = async (userId, lastDoc) => {
  const friendsListRef = collection(db, "users", userId, "friendsList");
  const friendsListQuery = query(
    friendsListRef,
    orderBy("displayName", "asc"),
    limit(5),
    startAfter(lastDoc)
  );
  const querySnapshot = await getDocs(friendsListQuery);

  const friendsList = querySnapshot.docs;

  const friendsListData = friendsList.map((friend) => {
    const friendData = friend.data();
    return {
      userId: friendData.userId,
      displayName: friendData.displayName,
      requestDate: friendData.requestDate.toString(),
      firebaseDoc: friend,
    };
  });
  console.log("FRIENDS LIST DATA: ", friendsListData);
  return friendsListData;
};

export const getMoreMessages = async (chatId, lastDoc) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const messagesQuery = query(
    messagesRef,
    orderBy("messageDate", "desc"),
    limit(5),
    startAfter(lastDoc)
  );
  const querySnapshot = await getDocs(messagesQuery);
  return querySnapshot;
};
