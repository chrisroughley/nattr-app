import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";

const SideBar = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const user = useSelector((state) => state.user.user);

  const friendRequestRef = collection(
    db,
    "users",
    user.userId,
    "pendingFriendRequests"
  );

  //get friend request data on component mount and listen for changes on the pendingFriendRequests collections
  useEffect(
    () =>
      onSnapshot(friendRequestRef, (snapshot) => {
        setFriendRequests(snapshot.docs);
      }),
    []
  );

  return (
    <div>
      <h1>Side Bar</h1>
      <p>friend requests: {friendRequests.length}</p>
    </div>
  );
};

export default SideBar;
