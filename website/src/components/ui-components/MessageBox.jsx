import { useState } from "react";
import { useForm } from "react-hook-form";

import { useSelector } from "react-redux";

import { sendMessage } from "../../utils/firebaseUtils";
import { sendFiles } from "../../utils/firebaseStorageUtils";

import { generateId } from "../../utils/componentUtils";

import "../../styles/messageBoxStyles.css";

const MessageBox = () => {
  const chatId = useSelector((state) => state.currentChat.currentChatId);
  const user = useSelector((state) => state.user.user);
  const { register, handleSubmit, setValue } = useForm();
  const [media, setMedia] = useState([]);
  const [messageBoxColor, setMessageBoxColor] = useState("unset");

  const onSubmit = async (data) => {
    if (media.length) {
      const mediaObject = {};
      media.forEach((file) => {
        mediaObject[file.fileId] = {
          status: "pending",
          downloadURL: "",
          type: file.fileData.type,
        };
      });
      const messageId = await sendMessage(
        chatId,
        user.displayName,
        user.userId,
        data.message,
        mediaObject
      );

      sendFiles(media, chatId, messageId);

      setMedia([]);
      setValue("media", []);
      setValue("message", "");
    } else if (data.message) {
      sendMessage(chatId, user.displayName, user.userId, data.message);
      setValue("message", "");
    }
  };

  const onError = (error) => {
    console.log("MESSAGE ERROR: ", error);
  };

  const addFileToMedia = (file) => {
    setMedia((media) => [
      ...media,
      {
        fileData: file,
        fileURL: URL.createObjectURL(file),
        fileId: generateId(),
      },
    ]);
  };

  const handleChange = (e) => {
    if (e.type === "change") {
      const files = [...e.target.files];
      console.log(files);
      files.forEach((file) => {
        console.log(file);
        addFileToMedia(file);
      });
    }
  };

  const handlePaste = async (e) => {
    if (e.clipboardData.files.length) {
      const file = await e.clipboardData.files[0];
      console.log(file);
      addFileToMedia(file);
    }
  };

  const handleDragEvent = async (e) => {
    e.preventDefault();
    switch (e.type) {
      case "dragover":
        if (messageBoxColor === "unset" && e.dataTransfer.files) {
          setMessageBoxColor("blue");
        }
        break;
      case "dragleave":
        if (messageBoxColor === "blue") {
          setMessageBoxColor("unset");
        }
        break;
      case "drop":
        const file = await e.dataTransfer.files[0];
        console.log(file);
        if (messageBoxColor === "blue") {
          setMessageBoxColor("unset");
        }
        if (file.type) {
          addFileToMedia(file);
        }
        break;
      default:
        break;
    }
  };

  const testStyle = {
    backgroundColor: messageBoxColor,
  };

  return (
    <div
      onDragLeave={handleDragEvent}
      onDragOver={handleDragEvent}
      onDrop={handleDragEvent}
      className={"message-box-container"}
    >
      {media[0] && (
        <ul className="selected-files">
          {media.map((file) => {
            console.log(file);
            return (
              <li key={file.fileData.lastModified}>
                {file.fileData.type.includes("image") ? (
                  <img src={file.fileURL} alt="" height="100" width="100" />
                ) : file.fileData.type.includes("video") ? (
                  <video
                    controls
                    src={file.fileURL}
                    height="100"
                    width="100"
                  ></video>
                ) : file.fileData.type.includes("audio") ? (
                  <audio />
                ) : (
                  <p>file</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <label>
          choose file
          <input
            type="file"
            multiple
            {...register("media", { onChange: handleChange })}
          />
        </label>
        <label>
          <input onPaste={handlePaste} type="text" {...register("message")} />
          <input type="submit" value="send" />
        </label>
      </form>
    </div>
  );
};

export default MessageBox;
