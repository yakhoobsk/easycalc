import { createAsyncThunk } from "@reduxjs/toolkit";
import { calcFlask } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";

export const resourceDetails = createAsyncThunk(
  "resourceDetails/get",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get(`/projects/${projectId}/resource_allocation`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const complexityDistributionDetails = createAsyncThunk(
  "resource/complexityDistributionDetails",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get(`/projects/${projectId}/complexity_distribution`);
      return response?.data?.data || [];
    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch complexity distribution"
      );
    }
  }
);