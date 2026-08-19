import { createAsyncThunk } from "@reduxjs/toolkit";
import { calcFlask } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";


export const createProject = createAsyncThunk(
  "project/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await calcFlask.post(`/projects`, payload);

      const data = response?.data?.data || response?.data;

      showSnackbar("success", response?.data?.UI_Display_Message || "Project created successfully");

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Project creation failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);

export const projectsDetails = createAsyncThunk(
  "projectsDetails/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get('/projects');

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const projectDetails = createAsyncThunk(
  "projectDetails/get",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get(`/projects/${projectId}`);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const projectCalc = createAsyncThunk(
  "projectCalc/post",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await calcFlask.post(`/projects/${projectId}/recalculate`);

      return response?.data?.data || response?.data;
    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Project calculation failed"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/update",
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const response = await calcFlask.put(`/projects/${projectId}`, payload);

      const data = response?.data?.data || response?.data;

      showSnackbar("success", response?.data?.UI_Display_Message || "Project updated successfully");

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Project update failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);

export const updateProjectRoles = createAsyncThunk(
  "projectRoles/update",
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const response = await calcFlask.put(
        `/projects/${projectId}/roles`,
        payload
      );
      return response?.data?.data || response?.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Project roles update failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);