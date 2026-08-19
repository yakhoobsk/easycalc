import { createSlice } from "@reduxjs/toolkit";
import { projectDetails, projectsDetails, projectCalc, updateProject, createProject, updateProjectRoles } from "../services/inputService";

const initialState = {
  loading: false,
  inputData: null,
  projectsData: null,
  projCalcData: null,
  createProjectData: null,
  updateProjectData: null,
  projectRolesUpdateData: null,
  success: false,
  error: null
};

const inputSlice = createSlice({
  name: "Input",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.createProjectData = action.payload;
        state.success = true;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Project creation failed";
        state.success = false;
      })
      .addCase(projectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(projectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.inputData = action.payload;
      })

      .addCase(projectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(projectsDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(projectsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.projectsData = action.payload;
      })

      .addCase(projectsDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(projectCalc.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(projectCalc.fulfilled, (state, action) => {
        state.loading = false;
        state.projCalcData = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(projectCalc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Project calculation failed";
        state.success = false;
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.updateProjectData = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.updateProjectData = null;
        state.success = false;
        state.error = action.payload || "Project update failed";
      })
      .addCase(updateProjectRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.projectRolesUpdateData = action.payload;
      })
      .addCase(updateProjectRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Project roles update failed";
      });
  }
});

export default inputSlice.reducer;