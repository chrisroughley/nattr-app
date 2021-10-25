import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";

export const getChatsByUserId = createAsyncThunk(
  "users/getChatsByUserId",
  async (userId, thunkAPI) => {
    const chatsListRef = collection(db, "users", userId, "chatsList");
    try {
      const querySnapshot = await getDocs(chatsListRef);
      const chatsList = querySnapshot.docs;
      if (chatsList.length) {
        const chatsListData = chatsList.map((chat) => {
          const chatData = chat.data();
          return {
            userId: chatData.userId,
            displayName: chatData.displayName,
            requestDate: chatData.requestDate.toString(),
          };
        });
        console.log("CHATS LIST DATA: ", chatsListData);
        return chatsListData;
      } else {
        return thunkAPI.rejectWithValue("no chats");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const userSlice = createSlice({
  name: "friends",
  initialState: {
    loading: "idle",
    friends: [],
    error: { message: "" },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFriendsByUserId.pending, (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });
    builder.addCase(getFriendsByUserId.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.friends = action.payload;
      }
    });
    builder.addCase(getFriendsByUserId.rejected, (state, action) => {
      if (state.loading === "pending") {
        console.log(action.payload);
        state.loading = "idle";
        state.error.message = action.payload;
      }
    });
  },
});

export default userSlice.reducer;
