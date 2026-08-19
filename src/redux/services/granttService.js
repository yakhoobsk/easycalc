import { createAsyncThunk } from "@reduxjs/toolkit";
import { calcFlask } from "./commonAxios";


export const granttGet = createAsyncThunk(
    "Grantt/get",
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await calcFlask.get(`/projects/${projectId}/gantt_phases`);
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const CreateGanttProject = createAsyncThunk(
    "ganttproject/create",
    async ({ grant_id, payload }, { rejectWithValue }) => {
        try {
            const response = await calcFlask.post(`/projects/${grant_id}/gantt_phases`, payload);
            return response?.data?.data || response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Gantt project creation failed"
            );
        }
    }
);


export const updateGanttProject = createAsyncThunk(
    "ganttproject/update",
    async ({ projectId, payload, grant_id }, { rejectWithValue }) => {
        try {
            const response = await calcFlask.put(`/projects/${projectId}/gantt_phases/${grant_id}`, payload);

            return response?.data?.data || response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Gantt project update failed"
            );
        }
    }
);
