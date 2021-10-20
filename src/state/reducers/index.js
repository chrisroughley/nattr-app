import { combineReducers } from "redux";
import counterReducer from "../slices/counterSlice";
import userReducer from "../slices/userSlice";
import friendsReducer from "../slices/friendsSlice";

export default combineReducers({
  counter: counterReducer,
  user: userReducer,
  friends: friendsReducer,
});
