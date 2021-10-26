import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  initializeChat,
} from "../../utils/firebaseUtils";

const SideBar = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const user = useSelector((state) => state.user.user);

  //get friend request data on component mount and listen for changes on the pendingFriendRequests collections
  useEffect(() => {
    if (!user.userId) return;
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
    await acceptFriendRequest(
      user.userId,
      userId,
      user.displayName,
      displayName
    );
    await initializeChat(
      [{ userId }, { userId: user.userId, displayName: user.displayName }],
      "friend"
    );
  };

  const handleRejectRequest = (userId) => {
    rejectFriendRequest(user.userId, userId);
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
