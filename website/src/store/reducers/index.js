import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import friendsReducer from "../slices/friendsSlice";
import currentChatReducer from "../slices/currentChatSlice";
import listPanelReducer from "../slices/listPanelSlice";
import friendRequestsReducer from "../slices/friendRequestsSlice";

export default combineReducers({
  friendRequests: friendRequestsReducer,
  listPanel: listPanelReducer,
  currentChat: currentChatReducer,
  user: userReducer,
  friends: friendsReducer,
});
