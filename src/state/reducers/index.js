import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import friendsReducer from "../slices/friendsSlice";
import currentChatReducer from "../slices/currentChatSlice";

export default combineReducers({
  currentChat: currentChatReducer,
  user: userReducer,
  friends: friendsReducer,
});
