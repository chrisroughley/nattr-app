import { useSelector } from "react-redux";

import SideBar from "../layouts/SideBar";
import FriendSearch from "../layouts/FriendSearch";
import FriendList from "../layouts/FriendList";
import ChatList from "../layouts/ChatList";
import Chat from "../layouts/Chat";
import FriendRequestList from "../layouts/FriendRequestList";

import "../../styles/main.css";

const MessengerPage = () => {
  const sidePanel = useSelector((state) => state.sidePanel.selectedPanel);
  const isListPanelOpen = useSelector(
    (state) => state.sidePanel.isSidePanelOpen
  );

  return (
    <div>
      <div className={"messenger-container"}>
        <div
          className={`side-panel-container ${
            isListPanelOpen ? "side-panel-visible" : "side-panel-hidden"
          }`}
        >
          <SideBar></SideBar>
          {sidePanel === "chatsList" && <ChatList></ChatList>}
          {sidePanel === "friendsList" && <FriendList></FriendList>}
          {sidePanel === "friendSearch" && <FriendSearch></FriendSearch>}
          {sidePanel === "friendRequests" && (
            <FriendRequestList></FriendRequestList>
          )}
        </div>
        <Chat></Chat>
      </div>
    </div>
  );
};

export default MessengerPage;
