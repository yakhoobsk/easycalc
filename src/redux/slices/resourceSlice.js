import { createSlice } from "@reduxjs/toolkit";
import { complexityDistributionDetails, resourceDetails } from "../services/resourceService";

const initialState = {
  loading: false,
  resourceData: null,
  complexityDistributionData: [],
  error: null
};

const resourceSlice = createSlice({
  name: "Resource",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(resourceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resourceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.resourceData = action.payload;
      })

      .addCase(resourceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(complexityDistributionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(complexityDistributionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.complexityDistributionData = action.payload || [];
      })
      .addCase(complexityDistributionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch complexity distribution";
      });
  }
});

export default resourceSlice.reducer;