import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
  const response = await axios.get('/leads');
  return response.data;
});

export const createLead = createAsyncThunk('leads/createLead', async (leadData) => {
  const response = await axios.post('/leads', leadData);
  return response.data;
});

export const updateLead = createAsyncThunk('leads/updateLead', async ({ id, leadData }) => {
  const response = await axios.put(`/leads/${id}`, leadData);
  return response.data;
});

export const deleteLead = createAsyncThunk('leads/deleteLead', async (id) => {
  await axios.delete(`/leads/${id}`);
  return id;
});

// Initial state
const initialState = {
  leads: [],
  loading: false,
  error: null,
};

// Slice
const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create lead
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads.push(action.payload);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update lead
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leads.findIndex(lead => lead._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete lead
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.filter(lead => lead._id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = leadSlice.actions;
export default leadSlice.reducer; 