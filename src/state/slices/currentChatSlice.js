import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

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

export const currentChatSlice = createSlice({
  name: "currentChat",
  initialState: {
    loading: "idle",
    currentChat: {},
    messages: [],
    currentChatId: "",
    error: { message: "" },
  },
  reducers: {
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChatByChatId.pending, (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });
    builder.addCase(getChatByChatId.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.currentChat = action.payload;
      }
    });
    builder.addCase(getChatByChatId.rejected, (state, action) => {
      if (state.loading === "pending") {
        console.log(action.payload);
        state.loading = "idle";
        state.error.message = action.payload;
      }
    });
  },
});

export const { setCurrentChatId } = currentChatSlice.actions;
export default currentChatSlice.reducer;
