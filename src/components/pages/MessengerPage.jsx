import { Link } from "react-router-dom";

const MessengerPage = () => {
  const openVideoChat = () => {
    window.open(
      "video",
      "New_Window",
      "menubar=no,toolbar=no,width=1200,height=800"
    );
  };

  return (
    <div>
      <h1>Messenger Page</h1>
      <button onClick={openVideoChat}>Video</button>
      <Link to="/account">Account Managemnet</Link>
      <Link to="/">Sign Out</Link>
    </div>
  );
};

export default MessengerPage;
