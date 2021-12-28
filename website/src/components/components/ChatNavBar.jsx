import { useDispatch } from "react-redux";
import { setIsSidePanelOpen } from "../../store/slices/sidePanelSlice";

import "../../styles/chatNavBarStyles.css";

const ChatNav = ({ setIsChatOptionsOpen }) => {
  const dispatch = useDispatch();

  const handleBackClick = () => {
    dispatch(setIsSidePanelOpen(true));
  };

  const handleOptionsClick = () => {
    setIsChatOptionsOpen(true);
  };

  return (
    <div className="chat-nav-container">
      <div>
        <button className={"chat-back-button"} onClick={handleBackClick}>
          back
        </button>
        chat name
      </div>
      <div>
        chat nav
        <button onClick={handleOptionsClick}>options</button>
      </div>
    </div>
  );
};

export default ChatNav;
