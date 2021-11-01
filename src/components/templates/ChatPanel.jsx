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
            return (
              <li key={messageData.messageDate}>
                <h4>{messageData.displayName}</h4>
                <p>{messageData.message}</p>
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
