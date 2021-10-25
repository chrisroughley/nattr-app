import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import friendsReducer from "../slices/friendsSlice";
import chatsReducer from "../slices/chatsSlice";

export default combineReducers({
  chats: chatsReducer,
  user: userReducer,
  friends: friendsReducer,
});
