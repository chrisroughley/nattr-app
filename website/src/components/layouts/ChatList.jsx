import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setCurrentChatId } from "../../store/slices/currentChatSlice";
import { setIsSidePanelOpen } from "../../store/slices/sidePanelSlice";

import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../../utils/firebase.config";
import { getLatestChat } from "../../utils/firebaseFirestoreUtils";

import "../../styles/main.css";

const ChatList = () => {
  const dispatch = useDispatch();
  const [chatsList, setChatsList] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    (async () => {
      const latestChat = await getLatestChat(user.userId);
      if (!latestChat.empty) {
        dispatch(setCurrentChatId(latestChat.docs[0].data().chatId));
      }
    })();
  }, [user.userId, dispatch]);

  useEffect(() => {
    const chatsListRef = collection(
      db,
      "users",
      user.userId || "noUser",
      "chatsList"
    );
    const chatListQuery = query(chatsListRef, orderBy("messageDate", "asc"));
    const unSub = onSnapshot(chatListQuery, (snapshot) => {
      setChatsList(snapshot.docs);
      console.log("CHATS LIST DATA: ", snapshot.docs);
    });
    return unSub;
  }, [user.userId, dispatch]);

  const handleChat = (chatId) => {
    dispatch(setCurrentChatId(chatId));
    dispatch(setIsSidePanelOpen(false));
  };

  return (
    <div className={"chat-list-container"}>
      <h2>ChatsList</h2>
      <ul className="chat-list">
        {chatsList.map((chat) => {
          const chatData = chat.data();
          return (
            <li key={chatData.chatId}>
              <h4>chat id: {chatData.chatId}</h4>
              <p>last message: {chatData.message}</p>
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

export default ChatList;
