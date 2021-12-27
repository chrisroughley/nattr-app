import MessageBox from "../components/MessageBox";
import ChatNavBar from "../components/ChatNavBar";
import ChatOptions from "../components/ChatOptions";

import { useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";

import { useSelector, useDispatch } from "react-redux";
import { getChatByChatId } from "../../store/thunks";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { db } from "../../utils/firebase.config";
import { getMoreMessages } from "../../utils/firebaseFirestoreUtils";

import "../../styles/chatStyles.css";

const ChatPanel = () => {
  const dispatch = useDispatch();
  const chatId = useSelector((state) => state.currentChat.currentChatId);
  const [messages, setMessages] = useState([]);
  const [isChatOptionsOpen, setIsChatOptionsOpen] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    dispatch(getChatByChatId(chatId));
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesQuery = query(
      messagesRef,
      orderBy("messageDate", "desc"),
      limit(20)
    );

    const isMediaUpload = (doc) => {
      if (!doc[0]) return false;
      const mediaContents = Object.values(doc[0].media);
      const hasDate = doc[0].messageDate;
      const isSingleDoc = doc.length === 1;
      const containsMedia = mediaContents.length >= 1;
      const isModified = doc[0].trigger === "modified";
      return hasDate && isSingleDoc && containsMedia && isModified;
    };

    const unSub = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const docChanges = snapshot.docChanges().map((doc) => {
          const docData = doc.doc.data();
          docData.id = doc.doc.id;
          docData.trigger = doc.type;
          docData.firebaseDoc = doc.doc;
          return docData;
        });
        console.log("DOC CHANGES: ", docChanges);
        console.log("SNAPSHOT METADATA: ", snapshot.metadata);

        if (!snapshot.metadata.hasPendingWrites) {
          setMessages((messages) => {
            let newMessagesArray = [];
            //check if doc change is from a media upload on the recipients client
            if (
              docChanges.length === 1 &&
              messages.find((message) => message.id === docChanges[0].id)
            ) {
              newMessagesArray = messages.map((message) => {
                const doc = docChanges[0];
                if (message.id === doc.id) {
                  return doc;
                } else {
                  return message;
                }
              });
            } else {
              newMessagesArray = [
                ...docChanges.flatMap((doc) => {
                  return doc.trigger !== "removed" ? [doc] : [];
                }),
                ...messages,
              ];
            }
            return newMessagesArray;
          });
          //check if doc change is from a media upload on the senders client
        } else if (isMediaUpload(docChanges)) {
          setMessages((messages) => {
            return messages.map((message) => {
              const doc = docChanges[0];
              if (message.id === doc.id) {
                return doc;
              } else {
                return message;
              }
            });
          });
        }
      },
      (error) => {
        console.log("ERROR: ", error);
      }
    );
    return unSub;
  }, [chatId, dispatch]);

  const handleInfiniteScroll = async (lastDoc) => {
    const moreMessages = await getMoreMessages(chatId, lastDoc);
    const moreMessagesData = moreMessages.docs.map((doc) => {
      const docData = doc.data();
      docData.id = doc.id;
      docData.firebaseDoc = doc;
      return docData;
    });
    console.log(moreMessagesData);
    setMessages((messages) => [...messages, ...moreMessagesData]);
  };

  return (
    <div className={"chat-panel-container"}>
      {isChatOptionsOpen && (
        <ChatOptions setIsChatOptionsOpen={setIsChatOptionsOpen}></ChatOptions>
      )}
      <ChatNavBar setIsChatOptionsOpen={setIsChatOptionsOpen}></ChatNavBar>
      <div className={"messages-container"}>
        <ul className={"messages"}>
          {messages.map((message, index) => {
            return (
              <li key={message.id}>
                {index === messages.length - 4 && (
                  <Waypoint
                    onEnter={() => {
                      handleInfiniteScroll(
                        messages[messages.length - 1].firebaseDoc
                      );
                    }}
                  />
                )}
                <h4>{message.displayName}</h4>
                {message.message && (
                  <p>
                    {message.message} -{" "}
                    {message.messageDate.toDate().toString()}
                  </p>
                )}
                <ul>
                  {Object.keys(message.media).map((key) => {
                    return (
                      <li key={key}>
                        {message.media[key].status === "pending" ? (
                          <p>pending</p>
                        ) : message.media[key].type.includes("image") ? (
                          <img
                            src={message.media[key].downloadURL}
                            height="100"
                            alt=""
                          />
                        ) : message.media[key].type.includes("video") ? (
                          <video
                            controls
                            src={message.media[key].downloadURL}
                            height="100"
                          />
                        ) : message.media[key].type.includes("audio") ? (
                          <audio
                            controls
                            src={message.media[key].downloadURL}
                          />
                        ) : (
                          <p>file</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {message.urlMetaData.status === "pending" && <p>pending</p>}
                {message.urlMetaData.status === "success" && (
                  <p>{message.urlMetaData.title}</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <MessageBox></MessageBox>
    </div>
  );
};
export default ChatPanel;
