import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/invoices');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/invoices/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendInvoice = createAsyncThunk(
  'invoices/sendInvoice',
  async ({ id, emailData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/invoices/${id}/send`, emailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  invoices: [],
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch invoices';
      })
      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create invoice';
      })
      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(invoice => invoice._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update invoice';
      })
      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(invoice => invoice._id !== action.payload);
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete invoice';
      })
      // Send Invoice
      .addCase(sendInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(invoice => invoice._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(sendInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send invoice';
      });
  },
});

export const { clearError } = invoiceSlice.actions;
export default invoiceSlice.reducer; 