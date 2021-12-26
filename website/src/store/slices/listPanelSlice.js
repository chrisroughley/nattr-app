import { createSlice } from "@reduxjs/toolkit";

export const listPanelSlice = createSlice({
  name: "listPanel",
  initialState: {
    selectedPanel: "chatsList",
  },
  reducers: {
    setSelectedPanel: (state, action) => {
      state.selectedPanel = action.payload;
    },
  },
});

export const { setSelectedPanel } = listPanelSlice.actions;

export default listPanelSlice.reducer;
