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
        return { userId, ...docSnap.data() };
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
    user: {
      userId: "no user",
      email: "no user",
      displayName: "no user",
    },
    isLogged: false,
    isInitialized: false,
    error: { message: "" },
  },
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    setIsInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    clearUser: (state, action) => {
      state.user = {
        userId: "no user",
        email: "no user",
        displayName: "no user",
      };
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
        state.isInitialized = true;
        state.isLogged = true;
        state.user = action.payload;
      }
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      if (state.loading === "pending") {
        console.log(action.payload);
        state.loading = "idle";
        state.isInitialized = true;
        state.isLogged = false;
        state.error.message = action.payload;
      }
    });
  },
});

export const { setIsLogged, setIsInitialized, clearUser } = userSlice.actions;
export default userSlice.reducer;
