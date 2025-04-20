import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/projects');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/projects', projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTeamMember = createAsyncThunk(
  'projects/addTeamMember',
  async ({ projectId, userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/team`, {
        userId,
        role
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to add team member');
    }
  }
);

export const removeTeamMember = createAsyncThunk(
  'projects/removeTeamMember',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/projects/${projectId}/team/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to remove team member');
    }
  }
);

export const addMilestone = createAsyncThunk(
  'projects/addMilestone',
  async ({ projectId, milestoneData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/milestones`, milestoneData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to add milestone');
    }
  }
);

export const updateMilestone = createAsyncThunk(
  'projects/updateMilestone',
  async ({ projectId, milestoneId, milestoneData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/projects/${projectId}/milestones/${milestoneId}`,
        milestoneData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to update milestone');
    }
  }
);

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch projects';
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create project';
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update project';
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(project => project._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete project';
      })
      // Add Team Member
      .addCase(addTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Team Member
      .addCase(removeTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Milestone
      .addCase(addMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(addMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Milestone
      .addCase(updateMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer; 