import { createAsyncThunk } from "@reduxjs/toolkit";
import { calcFlask } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";

export const complexityDetails = createAsyncThunk(
  "dashboard/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get(`/settings/complexity_tiers`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const updatecomplexityTiers = createAsyncThunk(
  "complexity/update",
  async ({ complexityTierId, payload }, { rejectWithValue }) => {
    try {
      const response = await calcFlask.put(
        `settings/complexity_tiers/${complexityTierId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      if (data?.Response_Status === "Failure") {
        showSnackbar("error", data?.UI_Display_Message || "Update failed");
        return rejectWithValue(data);
      }

      showSnackbar("success", data?.UI_Display_Message || "Complexity tier updated successfully");

      return data.data;
    } catch (error) {
      const message = error?.response?.data?.UI_Display_Message || "Update failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);

export const deptRolesDetails = createAsyncThunk(
  "deptRolesDetails/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await calcFlask.get('/settings/departments');
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const createRoleMaster = createAsyncThunk(
  "roleCreating/create",
  async (payload, { rejectWithValue }) => {
    try {

      const response = await calcFlask.post("settings/roles", payload);

      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      showSnackbar("success", data?.UI_Display_Message || "Role created successfully");

      return data;
    } catch (error) {
      const message = error?.response?.data?.message || "Role creation failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);

export const updateRoleMaster = createAsyncThunk(
  "role/update",
  async ({ roleId, payload }, { rejectWithValue }) => {
    try {
      const response = await calcFlask.put(
        `settings/roles/${roleId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      if (data?.Response_Status === "Failure") {
        showSnackbar("error", data?.UI_Display_Message || "Update failed");
        return rejectWithValue(data);
      }

      showSnackbar("success", data?.UI_Display_Message || "Role updated successfully");

      return data.data;
    } catch (error) {
      const message = error?.response?.data?.UI_Display_Message || "Update failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  }
);

export const deleteRoleMaster = createAsyncThunk(
  "role/delete",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await calcFlask.delete(`settings/roles/${roleId}`);

      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      if (data?.Response_Status === "Failure") {
        showSnackbar("error", data?.UI_Display_Message || "Delete failed");
        return rejectWithValue(data);
      }

      showSnackbar("success", data?.UI_Display_Message || "Role deleted successfully");

      return { roleId };
    } catch (error) {
      const message = error?.response?.data?.UI_Display_Message || "Delete failed";

      showSnackbar("error", message);

      return rejectWithValue(message);
    }
  });