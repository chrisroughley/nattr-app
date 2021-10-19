import { useEffect, useState } from "react";

import { db } from "../../utils/firebase";
import { collection, getDocs } from "@firebase/firestore";

import { useSelector } from "react-redux";

const FriendsList = () => {
  const user = useSelector((state) => state.user.user);
  const [friendsList, setFriendsList] = useState([]);

  const friendsListRef = collection(
    db,
    "users",
    user.userId || "pending",
    "friendsList"
  );

  useEffect(() => {
    const getFriendsList = async () => {
      const querySnapshot = await getDocs(friendsListRef);
      setFriendsList(querySnapshot.docs);
      console.log("QUERY SNAPSHOT: ", querySnapshot.docs);
    };
    getFriendsList();
  }, []);

  return (
    <div>
      <h1>Friends List</h1>
      <ul>
        {friendsList.map((friend) => {
          return (
            <li key={friend.data().userId}>{friend.data().displayName}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default FriendsList;
