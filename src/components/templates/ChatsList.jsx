import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../../utils/firebase";

const ChatsList = () => {
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

  return (
    <div>
      <h1>ChatsList</h1>
      <ul>
        {chatsList.map((chat) => {
          const chatData = chat.data();
          return <li key={chatData.chatId}>chat id: {chatData.chatId}</li>;
        })}
      </ul>
    </div>
  );
};

export default ChatsList;
