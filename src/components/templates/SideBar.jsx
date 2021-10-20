import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  onSnapshot,
  collection,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../utils/firebase";

const SideBar = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const user = useSelector((state) => state.user.user);

  //get friend request data on component mount and listen for changes on the pendingFriendRequests collections
  useEffect(() => {
    const friendRequestRef = collection(
      db,
      "users",
      user.userId,
      "pendingFriendRequests"
    );
    const unSub = onSnapshot(friendRequestRef, (snapshot) => {
      setFriendRequests(snapshot.docs);
      console.log("FRIEND REQUESTS: ", snapshot.docs);
    });
    return unSub;
  }, [user.userId]);

  const handleAcceptRequest = async (userId, displayName) => {
    const requestReceiverFriendsListRef = doc(
      db,
      "users",
      user.userId,
      "friendsList",
      userId
    );
    const requestSenderFriendsListRef = doc(
      db,
      "users",
      userId,
      "friendsList",
      user.userId
    );

    //set document in friends list collection to opposing users data and visa-versa
    await setDoc(
      requestReceiverFriendsListRef,
      {
        userId,
        displayName,
        requestDate: serverTimestamp(),
      },
      { merge: true }
    );
    await setDoc(
      requestSenderFriendsListRef,
      {
        userId: user.userId,
        displayName: user.displayName,
        requestDate: serverTimestamp(),
      },
      { merge: true }
    );

    const pendingFriendRequestRef = doc(
      db,
      "users",
      user.userId,
      "pendingFriendRequests",
      userId
    );

    //remove the pending friend request document
    await deleteDoc(pendingFriendRequestRef);
  };

  const handleRejectRequest = async (userId) => {
    const pendingFriendRequestRef = doc(
      db,
      "users",
      user.userId,
      "pendingFriendRequests",
      userId
    );

    //remove the pending friend request document
    await deleteDoc(pendingFriendRequestRef);
  };

  return (
    <div>
      <h1>Side Bar</h1>
      <p>friend requests: {friendRequests.length}</p>
      <ul>
        {friendRequests.map((friendRequest) => {
          const friendRequestData = friendRequest.data();
          return (
            <li key={friendRequestData.userId}>
              <p>{friendRequestData.displayName}</p>
              <button
                onClick={() => {
                  handleAcceptRequest(
                    friendRequestData.userId,
                    friendRequestData.displayName
                  );
                }}
              >
                accept request
              </button>
              <button
                onClick={() => {
                  handleRejectRequest(friendRequestData.userId);
                }}
              >
                decline request
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
