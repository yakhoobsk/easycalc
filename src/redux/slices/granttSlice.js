import { createSlice } from "@reduxjs/toolkit";
import { granttGet } from "../services/granttService";


const initialState = {
    loading: false,
    granttData: null,
    error: null
};


const granttSlice = createSlice({
    name: "Grantt",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(granttGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(granttGet.fulfilled, (state, action) => {
                state.loading = false;
                state.granttData = action.payload;
            })

            .addCase(granttGet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default granttSlice.reducer;