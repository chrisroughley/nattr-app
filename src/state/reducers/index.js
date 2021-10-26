import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import friendsReducer from "../slices/friendsSlice";
import currentChatReducer from "../slices/currentChatSlice";
import listPanelReducer from "../slices/listPanelSlice";

export default combineReducers({
  listPanel: listPanelReducer,
  currentChat: currentChatReducer,
  user: userReducer,
  friends: friendsReducer,
});
