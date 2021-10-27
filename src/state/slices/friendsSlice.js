import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";

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
