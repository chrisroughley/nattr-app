import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setCurrentChatId } from "../../state/slices/currentChatSlice";

import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../../utils/firebase";

const ChatsList = () => {
  const dispatch = useDispatch();
  const [chatsList, setChatsList] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!user.userId) return;
    const chatsListRef = collection(db, "users", user.userId, "chatsList");
    const unSub = onSnapshot(chatsListRef, (snapshot) => {
      setChatsList(snapshot.docs);
      console.log("CHATS LIST DATA: ", snapshot.docs);
    });
    return unSub;
  }, [user.userId]);

  const handleChat = (chatId) => {
    dispatch(setCurrentChatId(chatId));
  };

  return (
    <div>
      <h1>ChatsList</h1>
      <ul>
        {chatsList.map((chat) => {
          const chatData = chat.data();
          return (
            <li key={chatData.chatId}>
              <h4>chat id: {chatData.chatId}</h4>
              <button
                onClick={() => {
                  handleChat(chatData.chatId);
                }}
              >
                chat
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatsList;