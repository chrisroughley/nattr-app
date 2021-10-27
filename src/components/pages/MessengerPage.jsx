import { Link, useHistory } from "react-router-dom";

import { setIsLogged, clearUser } from "../../state/slices/userSlice";
import { clearChat } from "../../state/slices/currentChatSlice";
import { clearFriendRequests } from "../../state/slices/friendRequestsSlice";
import { clearFriends } from "../../state/slices/friendsSlice";
import { setSelectedPanel } from "../../state/slices/listPanelSlice";
import { useDispatch, useSelector } from "react-redux";

import { auth } from "../../utils/firebase";
import { signOut } from "@firebase/auth";

import DevComponent from "../DevComponent";
import SideBar from "../templates/SideBar";
import FriendsSearch from "../templates/FriendsSearch";
import FriendsList from "../templates/FriendsList";
import ChatsList from "../templates/ChatsList";
import ChatPanel from "../templates/ChatPanel";

import "../../styles/messengerPageStyles.css";
import FriendRequests from "../templates/FriendRequests";

const MessengerPage = () => {
  const listPanel = useSelector((state) => state.listPanel.selectedPanel);
  const dispatch = useDispatch();
  const history = useHistory();

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
      history.push("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <div className={"layout"}>
        <div className={"side-bar-panel"}>
          <h1>Messenger Page</h1>
          <button onClick={openVideoChat}>Video</button>
          <Link to="/account">Account Management</Link>
          <button onClick={handleSignOut}>Sign Out</button>
          <SideBar></SideBar>
        </div>
        <div className={"social-lists-panel"}>
          {listPanel === "chatsList" ? (
            <ChatsList></ChatsList>
          ) : listPanel === "friendsList" ? (
            <FriendsList></FriendsList>
          ) : listPanel === "friendSearch" ? (
            <FriendsSearch></FriendsSearch>
          ) : listPanel === "friendRequests" ? (
            <FriendRequests></FriendRequests>
          ) : (
            ""
          )}
        </div>
        <div className={"chat-panel"}>
          <ChatPanel></ChatPanel>
        </div>
      </div>
      <DevComponent></DevComponent>
    </div>
  );
};

export default MessengerPage;
