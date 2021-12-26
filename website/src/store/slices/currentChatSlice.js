import { createSlice } from "@reduxjs/toolkit";

import { getChatByChatId } from "../thunks";

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
    clearChat: (state, action) => {
      state.currentChat = {};
      state.messages = [];
      state.currentChatId = "";
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

export const { setCurrentChatId, clearChat } = currentChatSlice.actions;
export default currentChatSlice.reducer;
