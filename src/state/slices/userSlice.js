import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, thunkAPI) => {
    const docRef = doc(db, "users", userId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return thunkAPI.rejectWithValue("no user");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: "idle",
    user: {},
    isLogged: false,
    error: { message: "" },
  },
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserById.pending, (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.user = action.payload;
      }
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      if (state.loading === "pending") {
        console.log(action.payload);
        state.loading = "idle";
        state.error.message = action.payload;
      }
    });
  },
});

export const { setIsLogged } = userSlice.actions;
export default userSlice.reducer;
