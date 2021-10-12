import { combineReducers } from "redux";
import counterReducer from "../slices/counterSlice";
import userReducer from "../slices/userSlice";

export default combineReducers({
  counter: counterReducer,
  user: userReducer,
});
