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
  },
});

export const { setFriendRequests } = friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;
