import { createSlice } from "@reduxjs/toolkit";
import { LoginUser, LogoutUser } from "../services/authService";
import { removeSecureItem } from "../../utils/webSecureStorage";

const initialState = {
    loading: false,
    auth: null,
    error: null,
    logout: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuth(state) {
            state.auth = null;
            state.loading = false;
            removeSecureItem("accessToken");
            removeSecureItem("refreshToken");
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(LoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(LoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.auth = action.payload;
            })

            .addCase(LoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })

            .addCase(LogoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.logout = action.payload;
            })

            .addCase(LogoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            });
    }
});

export default authSlice.reducer;
export const { clearAuth } = authSlice.actions;