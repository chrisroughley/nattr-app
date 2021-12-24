import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { doc, setDoc } from "@firebase/firestore";

import { db, storage } from "./firebaseConfig";

export const sendFiles = async (files, chatId, messageId) => {
  const messageRef = doc(db, "chats", chatId, "messages", messageId);

  files.forEach(async (file) => {
    const storageName = file.fileId + file.fileData.name;
    const fileRef = ref(storage, storageName);
    const filesRef = doc(db, "chats", chatId, "files", file.fileId);
    const uploadTask = uploadBytesResumable(fileRef, file.fileData);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      async (err) => {
        console.log(err.message);
        await setDoc(
          messageRef,
          {
            media: {
              [file.fileId]: {
                downloadURL: "",
                status: "error",
                type: file.fileData.type,
              },
            },
          },
          { merge: true }
        );
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
                fileId: file.fileId,
              },
            },
          },
          { merge: true }
        );
        await setDoc(filesRef, {
          downloadURL,
          type: file.fileData.type,
        });
      }
    );
  });
};
