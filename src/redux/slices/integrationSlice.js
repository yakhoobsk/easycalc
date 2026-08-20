import { createSlice } from "@reduxjs/toolkit";
import {
  getComplexityFactors,
  listIntegrationAssessments,
  createIntegrationAssessment,
  updateIntegrationAssessment,
  deleteIntegrationAssessment,
} from "../services/integrationService";


const initialState = {
  loading: false,
  factors: [],
  assessments: [],
  error: null,
};


const integrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getComplexityFactors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComplexityFactors.fulfilled, (state, action) => {
        state.loading = false;
        state.factors = action.payload || [];
      })
      .addCase(getComplexityFactors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(listIntegrationAssessments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listIntegrationAssessments.fulfilled, (state, action) => {
        state.loading = false;
        state.assessments = action.payload || [];
      })
      .addCase(listIntegrationAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(createIntegrationAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIntegrationAssessment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.assessments = [...state.assessments, action.payload];
        }
      })
      .addCase(createIntegrationAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(updateIntegrationAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIntegrationAssessment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated) {
          state.assessments = state.assessments.map((a) =>
            a.id === updated.id ? updated : a
          );
        }
      })
      .addCase(updateIntegrationAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(deleteIntegrationAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIntegrationAssessment.fulfilled, (state, action) => {
        state.loading = false;
        const { assessmentId } = action.payload || {};
        state.assessments = state.assessments.filter((a) => a.id !== assessmentId);
      })
      .addCase(deleteIntegrationAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      });
  }
});

export default integrationSlice.reducer;
