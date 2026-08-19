import { createAsyncThunk } from "@reduxjs/toolkit";
import { calcFlask } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";

export const dashboardDetails = createAsyncThunk(
  "dashboard/get",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get(`/projects/${projectId}/dashboard`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);