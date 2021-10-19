import { useSelector } from "react-redux";

import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "@firebase/auth";

import { index } from "../utils/algolia";
import { deleteDoc, doc, serverTimestamp, setDoc } from "@firebase/firestore";

const DevComponent = () => {
  const user = useSelector((state) => state.user.user);

  const getReduxUser = () => {
    console.log(user);
  };
  const getAuthUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      } else {
        console.log("no user signed in");
      }
    });
  };
  const searchTest = async () => {
    const hits = await index.search("test");
    console.log(hits);
  };

  const createCollectionTest = async () => {
    await setDoc(
      doc(db, "users", user.userId, "pendingFriendRequests", user.userId),
      {
        userId: user.userId,
        requestDate: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const deleteDocumentTest = async () => {
    await deleteDoc(
      doc(db, "users", user.userId, "pendingFriendRequests", user.userId)
    );
  };

  return (
    <div>
      <button onClick={getReduxUser}>redux user</button>
      <button onClick={getAuthUser}>auth user</button>
      <button onClick={createCollectionTest}>create collection test</button>
      <button onClick={deleteDocumentTest}>delete document test</button>
    </div>
  );
};

export default DevComponent;
