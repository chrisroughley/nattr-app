import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedPanel } from "../../state/slices/listPanelSlice";
import { setFriendRequests } from "../../state/slices/friendRequestsSlice";
import { setIsLogged, clearUser } from "../../state/slices/userSlice";
import { clearChat } from "../../state/slices/currentChatSlice";
import { clearFriendRequests } from "../../state/slices/friendRequestsSlice";
import { clearFriends } from "../../state/slices/friendsSlice";

import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { auth } from "../../utils/firebase";
import { signOut } from "@firebase/auth";

import "../../styles/sideBarStyles.css";

const SideBar = () => {
  const navigate = useNavigate();
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

  const openVideoChat = () => {
    window.open(
      "video",
      "New_Window",
      "menubar=no,toolbar=no,width=1200,height=800"
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(setIsLogged(false));
      dispatch(clearUser());
      dispatch(clearChat());
      dispatch(clearFriendRequests());
      dispatch(clearFriends());
      dispatch(setSelectedPanel("chatsList"));
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

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
      <button onClick={openVideoChat}>Video</button>
      <Link to="/account">Account Management</Link>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default SideBar;
