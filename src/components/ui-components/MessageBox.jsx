import { useState } from "react";
import { useForm } from "react-hook-form";

import { useSelector } from "react-redux";

import { sendMessage } from "../../utils/firebaseUtils";
import { sendFiles } from "../../utils/firebaseStorageUtils";
import { storage } from "../../utils/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { generateId } from "../../utils/componentUtils";

import "../../styles/messageBoxStyles.css";

const MessageBox = () => {
  const chatId = useSelector((state) => state.currentChat.currentChatId);
  const user = useSelector((state) => state.user.user);
  const { register, handleSubmit, setValue } = useForm();
  const [media, setMedia] = useState([]);

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

      await sendFiles(media, chatId, messageId);

      setMedia([]);
      setValue("media", []);
      setValue("message", "");
    } else if (data.message) {
      await sendMessage(chatId, user.displayName, user.userId, data.message);
      setValue("message", "");
    }
  };

  const onError = (error) => {
    console.log("MESSAGE ERROR: ", error);
  };

  const handleChange = (e) => {
    if (e.type === "change") {
      const files = [...e.target.files];
      console.log(files);
      files.forEach((file) => {
        console.log(file);
        setMedia((media) => [
          ...media,
          {
            fileData: file,
            fileURL: URL.createObjectURL(file),
            fileId: generateId(),
          },
        ]);
      });
    }
  };

  return (
    <div className={"message-box"}>
      <ul className="selected-files">
        {media.map((file) => {
          console.log(file);
          return (
            <li key={file.fileData.lastModified}>
              {file.fileData.type === "image/jpeg" ? (
                <img src={file.fileURL} alt="" height="100" width="100" />
              ) : (
                <video
                  controls
                  src={file.fileURL}
                  height="100"
                  width="100"
                ></video>
              )}
            </li>
          );
        })}
      </ul>
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
          <input type="text" {...register("message")} />
          <input type="submit" value="send" />
        </label>
      </form>
    </div>
  );
};

export default MessageBox;
