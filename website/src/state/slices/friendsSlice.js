import { createSlice } from "@reduxjs/toolkit";

import { getFriendsByUserId } from "../thunks";

export const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    loading: "idle",
    friends: [],
    error: { message: "" },
  },
  reducers: {
    clearFriends: (state, action) => {
      state.friends = [];
    },
  },
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

export const { clearFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
