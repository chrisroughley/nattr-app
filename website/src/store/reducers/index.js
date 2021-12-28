import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import friendsReducer from "../slices/friendsSlice";
import currentChatReducer from "../slices/currentChatSlice";
import sidePanelReducer from "../slices/sidePanelSlice";
import friendRequestsReducer from "../slices/friendRequestsSlice";

export default combineReducers({
  friendRequests: friendRequestsReducer,
  sidePanel: sidePanelReducer,
  currentChat: currentChatReducer,
  user: userReducer,
  friends: friendsReducer,
});
