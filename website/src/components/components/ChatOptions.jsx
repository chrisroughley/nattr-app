import "../../styles/chatOptionsStyles.css";

const ChatOptions = ({ setIsChatOptionsOpen }) => {
  return (
    <div className="chat-options-container">
      Chat Options
      <button
        onClick={() => {
          setIsChatOptionsOpen(false);
        }}
      >
        close
      </button>
    </div>
  );
};

export default ChatOptions;
