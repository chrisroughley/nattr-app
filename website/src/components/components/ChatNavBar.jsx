import "../../styles/chatNavBarStyles.css";

const ChatNav = ({ setIsChatOptionsOpen }) => {
  return (
    <div className="chat-nav-container">
      <div>chat name</div>
      <div>
        chat nav
        <button
          onClick={() => {
            setIsChatOptionsOpen(true);
          }}
        >
          options
        </button>
      </div>
    </div>
  );
};

export default ChatNav;
