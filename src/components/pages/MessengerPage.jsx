import { Link, useHistory } from "react-router-dom";
import { setIsLogged, clearUser } from "../../state/slices/userSlice";
import { useDispatch } from "react-redux";

import { auth } from "../../utils/firebase";
import { signOut } from "@firebase/auth";

import DevComponent from "../DevComponent";
import SideBar from "../templates/SideBar";

const MessengerPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const openVideoChat = () => {
    window.open(
      "video",
      "New_Window",
      "menubar=no,toolbar=no,width=1200,height=800"
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(setIsLogged(false));
      dispatch(clearUser());
      history.push("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <h1>Messenger Page</h1>
      <button onClick={openVideoChat}>Video</button>
      <Link to="/account">Account Management</Link>
      <button onClick={handleSignOut}>Sign Out</button>
      <SideBar></SideBar>
      <DevComponent></DevComponent>
    </div>
  );
};

export default MessengerPage;
