import {
  onValue,
  onDisconnect,
  ref,
  set,
  serverTimestamp,
} from "firebase/database";
import { database } from "./firebase";
import { auth } from "./firebase";

export const handlePresence = () => {
  const uid = auth.currentUser.uid;

  const userStatusRef = ref(database, "status/" + uid);

  const isOfflineForDatabase = {
    state: "offline",
    last_changed: serverTimestamp(),
  };

  const isOnlineForDatabase = {
    state: "online",
    last_changed: serverTimestamp(),
  };

  set(userStatusRef, isOnlineForDatabase);

  const infoConnectedRef = ref(database, ".info/connected");

  onValue(infoConnectedRef, async (snapshot) => {
    if (snapshot.val() === false) {
      return;
    }

    onDisconnect(userStatusRef)
      .set(isOfflineForDatabase)
      .then(() => {
        set(userStatusRef, isOnlineForDatabase);
      });
  });
};
