import { createAsyncThunk } from "@reduxjs/toolkit";
import { calcFlask } from "./commonAxios";


export const LoginUser = createAsyncThunk(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await calcFlask.post(`/auth/login`, payload);

            return response?.data?.data || response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Login failed"
            );
        }
    }
);



export const LogoutUser = createAsyncThunk(
    "auth/logout",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await calcFlask.post(`/auth/logout`, payload);

            return response?.data?.data || response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Logout failed"
            );
        }
    }
);
