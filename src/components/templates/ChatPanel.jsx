import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getChatByChatId } from "../../state/slices/currentChatSlice";

import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../../utils/firebase";
import { sendMessage } from "../../utils/firebaseUtils";

import { useForm } from "react-hook-form";

import "../../styles/chatPanelStyles.css";

const ChatPanel = () => {
  const dispatch = useDispatch();
  const chatId = useSelector((state) => state.currentChat.currentChatId);
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const { register, handleSubmit, setValue } = useForm();

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

  const onSubmit = async (data) => {
    await sendMessage(chatId, user.displayName, user.userId, data.message);
    setValue("message", "", { shouldValidate: true });
  };

  const onError = (error) => {
    console.log("MESSAGE ERROR: ", error);
  };
  const registerOptions = { message: { required: "no message" } };

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
        <form
          className={"message-box"}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <label>
            send message
            <input
              type="text"
              {...register("message", registerOptions.message)}
            />
            <input type="submit" value="send" />
          </label>
        </form>
      </div>
    </div>
  );
};
export default ChatPanel;
