import { Link } from "react-router-dom";
import { setIsLogged } from "../../state/slices/userSlice";
import { useDispatch } from "react-redux";

const MessengerPage = () => {
  const dispatch = useDispatch();

  const openVideoChat = () => {
    window.open(
      "video",
      "New_Window",
      "menubar=no,toolbar=no,width=1200,height=800"
    );
  };

  const handleSignOut = () => {
    dispatch(setIsLogged(false));
  };

  return (
    <div>
      <h1>Messenger Page</h1>
      <button onClick={openVideoChat}>Video</button>
      <Link to="/account">Account Managemnet</Link>
      <Link onClick={handleSignOut} to="/">
        Sign Out
      </Link>
    </div>
  );
};

export default MessengerPage;
