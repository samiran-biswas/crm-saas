import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/tickets');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/tickets/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch tickets';
      })
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create ticket';
      })
      // Update Ticket
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tickets.findIndex(ticket => ticket._id === action.payload._id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update ticket';
      })
      // Delete Ticket
      .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = state.tickets.filter(ticket => ticket._id !== action.payload);
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete ticket';
      });
  },
});

export const { clearError } = ticketSlice.actions;
export default ticketSlice.reducer; 