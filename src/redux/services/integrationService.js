import { createAsyncThunk } from "@reduxjs/toolkit";
import { calcFlask } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";


export const getComplexityFactors = createAsyncThunk(
  "complexityFactors/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get(`/settings/complexity_factors`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const listIntegrationAssessments = createAsyncThunk(
  "integrationAssessments/list",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get(`/projects/${projectId}/integrations`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const createIntegrationAssessment = createAsyncThunk(
  "integrationAssessments/create",
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const response = await calcFlask.post(`/projects/${projectId}/integrations`, payload);

      showSnackbar("success", response?.data?.message || "Integration assessed successfully");

      return response?.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Integration assessment failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);

export const updateIntegrationAssessment = createAsyncThunk(
  "integrationAssessments/update",
  async ({ projectId, assessmentId, payload }, { rejectWithValue }) => {
    try {
      const response = await calcFlask.put(
        `/projects/${projectId}/integrations/${assessmentId}`,
        payload
      );

      showSnackbar("success", response?.data?.message || "Integration assessment updated successfully");

      return response?.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Integration assessment update failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);

export const deleteIntegrationAssessment = createAsyncThunk(
  "integrationAssessments/delete",
  async ({ projectId, assessmentId }, { rejectWithValue }) => {
    try {
      const response = await calcFlask.delete(
        `/projects/${projectId}/integrations/${assessmentId}`
      );

      showSnackbar("success", response?.data?.message || "Integration assessment deleted successfully");

      return { assessmentId };
    } catch (error) {
      const message =
        error.response?.data?.message || "Integration assessment delete failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);
