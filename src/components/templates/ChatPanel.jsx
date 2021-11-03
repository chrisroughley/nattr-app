import MessageBox from "../ui-components/MessageBox";

import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getChatByChatId } from "../../state/slices/currentChatSlice";

import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../../utils/firebase";

import "../../styles/chatPanelStyles.css";

const ChatPanel = () => {
  const dispatch = useDispatch();
  const chatId = useSelector((state) => state.currentChat.currentChatId);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;
    dispatch(getChatByChatId(chatId));
    const messagesRef = collection(db, "chats", chatId, "messages");
    const unSub = onSnapshot(messagesRef, (snapshot) => {
      setMessages(snapshot.docs);
      console.log("MESSAGES: ", snapshot.docs);
    });
    return unSub;
  }, [chatId]);

  return (
    <div>
      <h1>Chat Panel</h1>
      <ul></ul>
      <div>
        <ul>
          {messages.map((message) => {
            const messageData = message.data();

            console.log(messageData);
            return (
              <li key={messageData.messageDate}>
                <h4>{messageData.displayName}</h4>
                {messageData.message && <p>{messageData.message}</p>}
                <ul>
                  {Object.values(messageData.media).map((file) => {
                    return (
                      <li key={file.fileId}>
                        {file.status === "pending" ? (
                          <p>pending</p>
                        ) : file.type.includes("image") ? (
                          <img src={file.downloadURL} height="100" alt="" />
                        ) : file.type.includes("video") ? (
                          <video controls src={file.downloadURL} height="100" />
                        ) : file.type.includes("audio") ? (
                          <audio controls src={file.downloadURL} />
                        ) : (
                          <p>file</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
        <MessageBox></MessageBox>
      </div>
    </div>
  );
};
export default ChatPanel;
