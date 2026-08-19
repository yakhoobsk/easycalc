import { createSlice } from "@reduxjs/toolkit";
import {
  complexityDetails,
  deptRolesDetails,
  createRoleMaster,
  updateRoleMaster,
  deleteRoleMaster,
  updatecomplexityTiers,
} from "../services/settingsService";

const initialState = {
  loading: false,
  isLoading: false,
  complexityData: [],
  updatecomplexityData: null,
  error: null,
  deptRolesData: [],
  roleCreate: null,
  updateRole: null,
  deleteRole: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(complexityDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(complexityDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.complexityData = action.payload || [];
      })
      .addCase(complexityDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(updatecomplexityTiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatecomplexityTiers.fulfilled, (state, action) => {
        state.loading = false;
        state.updatecomplexityData = action.payload;

        const updatedComplexity = action.payload;

        if (Array.isArray(state.complexityData)) {
          state.complexityData = state.complexityData.map((complexity) =>
            complexity.complexity_tier_id === updatedComplexity.complexity_tier_id
              ? updatedComplexity
              : complexity
          );
        }
      })
      .addCase(updatecomplexityTiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(deptRolesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deptRolesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.deptRolesData = action.payload || [];
      })
      .addCase(deptRolesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(createRoleMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRoleMaster.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleCreate = action.payload;

        if (Array.isArray(state.deptRolesData)) {
          state.deptRolesData.push(action.payload);
        }
      })
      .addCase(createRoleMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(updateRoleMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoleMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.updateRole = action.payload;

        const updatedRole = action.payload;

        if (Array.isArray(state.deptRolesData)) {
          state.deptRolesData = state.deptRolesData.map((role) =>
            role.id === updatedRole.id || role.role_id === updatedRole.role_id
              ? updatedRole
              : role
          );
        }
      })
      .addCase(updateRoleMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      })

      .addCase(deleteRoleMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRoleMaster.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteRole = action.payload;

        const deletedRole = action.payload;

        if (Array.isArray(state.deptRolesData)) {
          state.deptRolesData = state.deptRolesData.filter(
            (role) =>
              role.id !== deletedRole?.id &&
              role.role_id !== deletedRole?.role_id
          );
        }
      })
      .addCase(deleteRoleMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      });
  },
});

export default settingsSlice.reducer;