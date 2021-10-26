import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedPanel } from "../../state/slices/listPanelSlice";
import { setFriendRequests } from "../../state/slices/friendRequestsSlice";

import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";

import "../../styles/sideBarStyles.css";

const SideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const friendRequests = useSelector(
    (state) => state.friendRequests.friendRequests
  );

  //get friend request data on component mount and listen for changes on the pendingFriendRequests collection
  useEffect(() => {
    if (!user.userId) return;
    const friendRequestRef = collection(
      db,
      "users",
      user.userId,
      "pendingFriendRequests"
    );
    const unSub = onSnapshot(friendRequestRef, (snapshot) => {
      dispatch(setFriendRequests(snapshot.docs));
      console.log("FRIEND REQUESTS: ", snapshot.docs);
    });
    return unSub;
  }, [user.userId]);

  const handleSetPanel = (listPanel) => {
    dispatch(setSelectedPanel(listPanel));
  };

  return (
    <div className="container">
      <h1>Side Bar</h1>
      <button
        onClick={() => {
          handleSetPanel("chatsList");
        }}
      >
        chats
      </button>
      <button
        onClick={() => {
          handleSetPanel("friendsList");
        }}
      >
        friends{friendRequests.length ? (": ", friendRequests.length) : ""}
      </button>
    </div>
  );
};

export default SideBar;
