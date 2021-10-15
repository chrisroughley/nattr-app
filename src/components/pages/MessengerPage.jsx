import { Link } from "react-router-dom";
import { setIsLogged, clearUser } from "../../state/slices/userSlice";
import { useDispatch } from "react-redux";

import { auth } from "../../utils/firebase";
import { signOut } from "@firebase/auth";

import DevComponent from "../DevComponent";

const MessengerPage = () => {
  const dispatch = useDispatch();

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
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <h1>Messenger Page</h1>
      <button onClick={openVideoChat}>Video</button>
      <Link to="/account">Account Managemnet</Link>
      <Link onClick={handleSignOut} to="/">
        Sign Out
      </Link>
      <DevComponent></DevComponent>
    </div>
  );
};

export default MessengerPage;
