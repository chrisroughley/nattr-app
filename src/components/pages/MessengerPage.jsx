import { Link, useHistory } from "react-router-dom";
import { setIsLogged, clearUser } from "../../state/slices/userSlice";
import { useDispatch } from "react-redux";

import { auth } from "../../utils/firebase";
import { signOut } from "@firebase/auth";

import DevComponent from "../DevComponent";

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
      <Link to="/account">Account Managemnet</Link>
      <button onClick={handleSignOut}>Sign Out</button>
      <DevComponent></DevComponent>
    </div>
  );
};

export default MessengerPage;
