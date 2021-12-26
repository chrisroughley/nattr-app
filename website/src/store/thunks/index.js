import { createAsyncThunk } from "@reduxjs/toolkit";

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase.config";

export const getChatByChatId = createAsyncThunk(
  "users/getChatByChatId",
  async (chatId, thunkAPI) => {
    const chatRef = doc(db, "chats", chatId);
    try {
      const docSnap = await getDoc(chatRef);
      if (docSnap.exists()) {
        const chatData = docSnap.data();
        console.log("CHATS DATA: ", chatData);
        return chatData;
      } else {
        return thunkAPI.rejectWithValue("no chat");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getFriendsByUserId = createAsyncThunk(
  "users/getFriendsByUserId",
  async (userId, thunkAPI) => {
    const friendsListRef = collection(db, "users", userId, "friendsList");
    try {
      const querySnapshot = await getDocs(friendsListRef);
      const friendsList = querySnapshot.docs;
      if (friendsList.length) {
        const friendsListData = friendsList.map((friend) => {
          const friendData = friend.data();
          return {
            userId: friendData.userId,
            displayName: friendData.displayName,
            requestDate: friendData.requestDate.toString(),
          };
        });
        console.log("FRIENDS LIST DATA: ", friendsListData);
        return friendsListData;
      } else {
        return thunkAPI.rejectWithValue("no friends");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, thunkAPI) => {
    const docRef = doc(db, "users", userId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { userId, ...docSnap.data() };
      } else {
        return thunkAPI.rejectWithValue("no user");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
