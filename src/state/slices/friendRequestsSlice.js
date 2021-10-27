import { createSlice } from "@reduxjs/toolkit";

export const friendRequestsSlice = createSlice({
  name: "friendRequests",
  initialState: {
    friendRequests: [],
  },
  reducers: {
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },
    clearFriendRequests: (state, action) => {
      state.friendRequests = [];
    },
  },
});

export const { setFriendRequests, clearFriendRequests } =
  friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;
