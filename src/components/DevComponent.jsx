import { useSelector } from "react-redux";

import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "@firebase/auth";

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

  return (
    <div>
      <button onClick={getReduxUser}>redux user</button>
      <button onClick={getAuthUser}>auth user</button>
    </div>
  );
};

export default DevComponent;
