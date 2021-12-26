import { createSlice } from "@reduxjs/toolkit";

import { getUserById } from "../thunks";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: "idle",
    user: {},
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
      state.user = {};
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
