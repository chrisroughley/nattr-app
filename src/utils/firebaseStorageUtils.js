import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { doc, setDoc } from "@firebase/firestore";

import { db, storage } from "./firebase";

export const sendFiles = async (files, chatId, messageId) => {
  const messageRef = doc(db, "chats", chatId, "messages", messageId);

  files.forEach(async (file) => {
    const fileRef = ref(storage, file.fileData.name);
    const uploadTask = uploadBytesResumable(fileRef, file.fileData);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (err) => {
        console.log(err.message);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await setDoc(
          messageRef,
          {
            media: {
              [file.fileId]: {
                downloadURL,
                status: "success",
                type: file.fileData.type,
              },
            },
          },
          { merge: true }
        );
      }
    );
  });
};
