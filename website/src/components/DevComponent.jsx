import { useSelector } from "react-redux";

import { auth, db, functions } from "../utils/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { httpsCallable } from "@firebase/functions";

import { doc, serverTimestamp, setDoc } from "@firebase/firestore";

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

  const callFunctionTest = async () => {
    const testFunction = httpsCallable(functions, "getMetaData");
    const result = await testFunction({
      url: "https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string",
      chatId: "noC9vvJ3lvv0HOHpQ7PS",
      messageId: "51f3CkpsNCOa4nZ6my2J",
    });
    console.log(result);
  };

  return (
    <div>
      <button onClick={getReduxUser}>redux user</button>
      <button onClick={getAuthUser}>auth user</button>
      <button onClick={createCollectionTest}>create collection test</button>
      <button onClick={callFunctionTest}>call function test</button>
    </div>
  );
};

export default DevComponent;
