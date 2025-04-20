import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  leads: [],
  customers: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setLeads: (state, action) => {
      state.leads = action.payload;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTickets, setLeads, setCustomers, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 