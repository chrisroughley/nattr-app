import { useSelector } from "react-redux";

import SideBar from "../layouts/SideBar";
import FriendSearch from "../layouts/FriendSearch";
import FriendList from "../layouts/FriendList";
import ChatList from "../layouts/ChatList";
import ChatPanel from "../layouts/ChatPanel";
import FriendRequestList from "../layouts/FriendRequestList";

import "../../styles/messengerPageStyles.css";

const MessengerPage = () => {
  const listPanel = useSelector((state) => state.listPanel.selectedPanel);

  return (
    <div>
      <div className={"messenger-container"}>
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
    </div>
  );
};

export default MessengerPage;
