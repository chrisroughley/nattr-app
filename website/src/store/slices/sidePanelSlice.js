import { createSlice } from "@reduxjs/toolkit";

export const sidePanelSlice = createSlice({
  name: "sidePanel",
  initialState: {
    selectedPanel: "chatsList",
    isSidePanelOpen: true,
  },
  reducers: {
    setSelectedPanel: (state, action) => {
      state.selectedPanel = action.payload;
    },
    setIsSidePanelOpen: (state, action) => {
      state.isSidePanelOpen = action.payload;
    },
  },
});

export const { setSelectedPanel, setIsSidePanelOpen } = sidePanelSlice.actions;

export default sidePanelSlice.reducer;
