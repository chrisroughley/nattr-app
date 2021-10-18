import { useSelector } from "react-redux";

import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "@firebase/auth";

import { index } from "../utils/algolia";

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

  return (
    <div>
      <button onClick={getReduxUser}>redux user</button>
      <button onClick={getAuthUser}>auth user</button>
      <button onClick={searchTest}>search test</button>
    </div>
  );
};

export default DevComponent;
