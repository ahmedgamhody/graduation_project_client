import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  isDashboardSidebarOpen: boolean;
};

const initialState: InitialStateType = {
  isDashboardSidebarOpen: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDashboardSidebar: (state) => {
      state.isDashboardSidebarOpen = true;
    },
    closeDashboardSidebar: (state) => {
      state.isDashboardSidebarOpen = false;
    },
  },
});

export const { openDashboardSidebar, closeDashboardSidebar } = uiSlice.actions;
export default uiSlice.reducer;
