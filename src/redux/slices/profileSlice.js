import { createSlice } from "@reduxjs/toolkit";
import { AllProfileDetails, ProfileDetails } from "../services/profileService";

const initialState = {
    loading: false,
    profile: null,
    allprofile: [],
    error: null
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(ProfileDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ProfileDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })

            .addCase(ProfileDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(AllProfileDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(AllProfileDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.allprofile = action.payload;
            })

            .addCase(AllProfileDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default profileSlice.reducer;