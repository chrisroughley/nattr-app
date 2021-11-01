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
import FriendSearch from "../templates/FriendSearch";
import FriendList from "../templates/FriendList";
import ChatList from "../templates/ChatList";
import ChatPanel from "../templates/ChatPanel";
import FriendRequestList from "../templates/FriendRequestList";

import "../../styles/messengerPageStyles.css";

const MessengerPage = () => {
  const listPanel = useSelector((state) => state.listPanel.selectedPanel);

  return (
    <div>
      <div className={"layout"}>
        <div className={"side-bar-panel"}>
          <SideBar></SideBar>
        </div>
        <div className={"social-lists-panel"}>
          {listPanel === "chatsList" && <ChatList></ChatList>}
          {listPanel === "friendsList" && <FriendList></FriendList>}
          {listPanel === "friendSearch" && <FriendSearch></FriendSearch>}
          {listPanel === "friendRequests" && (
            <FriendRequestList></FriendRequestList>
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
