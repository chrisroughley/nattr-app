import { useSelector } from "react-redux";

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
