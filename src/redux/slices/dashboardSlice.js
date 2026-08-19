import { createSlice } from "@reduxjs/toolkit";
import { dashboardDetails } from "../services/dashboardService";

const initialState = {
  loading: false,
  dashboardData: null,
  error: null
};

const dashboardSlice = createSlice({
  name: "Dashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(dashboardDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(dashboardDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })

      .addCase(dashboardDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;