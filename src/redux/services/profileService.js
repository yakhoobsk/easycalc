import { createAsyncThunk } from "@reduxjs/toolkit";
import { calcFlask } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";

export const ProfileDetails = createAsyncThunk(
    "ProfileDetails/get",
    async (user_id, { rejectWithValue }) => {
        try {
            const response = await calcFlask.get(`/users/${user_id}`);
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const AllProfileDetails = createAsyncThunk(
    "AllProfileDetails/get",
    async (_, { rejectWithValue }) => {
        try {
            const response = await calcFlask.get('/users');
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const createUser = createAsyncThunk(
    "createUser/create",
    async (payload, { rejectWithValue }) => {
        try {

            const response = await calcFlask.post("/users", payload);

            const data =
                typeof response.data === "string"
                    ? JSON.parse(response.data)
                    : response.data;

            showSnackbar("success", data?.UI_Display_Message || "User created successfully");

            return data;
        } catch (error) {
            const message = error?.response?.data?.message || "User creation failed";

            showSnackbar("error", message);

            return rejectWithValue(message);
        }
    }
);


export const createdeparment = createAsyncThunk(
    "createdeparment/create",
    async (payload, { rejectWithValue }) => {
        try {

            const response = await calcFlask.post("/settings/departments", payload);

            const data =
                typeof response.data === "string"
                    ? JSON.parse(response.data)
                    : response.data;

            showSnackbar("success", data?.UI_Display_Message || "Department created successfully");

            return data;
        } catch (error) {
            const message = error?.response?.data?.message || "Department creation failed";

            showSnackbar("error", message);

            return rejectWithValue(message);
        }
    }
);



export const updateUser = createAsyncThunk(
    "User/update",
    async ({ user_id, payload }, { rejectWithValue }) => {
        try {
            const response = await calcFlask.put(
                `/users/${user_id}`,
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

            showSnackbar("success", data?.UI_Display_Message || "User updated successfully");

            return data.data;
        } catch (error) {
            const message = error?.response?.data?.UI_Display_Message || "Update failed";

            showSnackbar("error", message);

            return rejectWithValue(message);
        }
    }
);




export const deleteUser = createAsyncThunk(
    "user/delete",
    async (user_id, { rejectWithValue }) => {
        try {
            const response = await calcFlask.delete(`/users/${user_id}`);

            const data =
                typeof response.data === "string"
                    ? JSON.parse(response.data)
                    : response.data;

            if (data?.Response_Status === "Failure") {
                showSnackbar("error", data?.UI_Display_Message || "Delete failed");
                return rejectWithValue(data);
            }

            showSnackbar("success", data?.UI_Display_Message || "User deleted successfully");

            return user_id; // ✅ return deleted id
        } catch (error) {
            const message = error?.response?.data?.UI_Display_Message || "Delete failed";

            showSnackbar("error", message);

            return rejectWithValue(message);
        }
    }
);