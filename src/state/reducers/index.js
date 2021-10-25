import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import friendsReducer from "../slices/friendsSlice";

export default combineReducers({
  user: userReducer,
  friends: friendsReducer,
});
