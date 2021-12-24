import {
  onValue,
  onDisconnect,
  ref,
  set,
  serverTimestamp,
  push,
} from "firebase/database";
import { database } from "./firebaseConfig";
import { auth } from "./firebaseConfig";

export const handlePresence = () => {
  const uid = auth.currentUser.uid;
  const userConnectionsRef = ref(database, "status/" + uid + "/connections");
  const lastOnlineRef = ref(database, "status/" + uid + "/lastOnline");
  const infoConnectedRef = ref(database, ".info/connected");

  onValue(infoConnectedRef, async (snapshot) => {
    if (snapshot.val() === false) return;

    const connectionRef = push(userConnectionsRef);

    onDisconnect(connectionRef).remove();

    set(connectionRef, true);

    onDisconnect(lastOnlineRef).set(serverTimestamp());
  });
};
