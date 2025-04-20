import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchQuotations = createAsyncThunk(
  'quotations/fetchQuotations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/quotations');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createQuotation = createAsyncThunk(
  'quotations/createQuotation',
  async (quotationData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/quotations', quotationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateQuotation = createAsyncThunk(
  'quotations/updateQuotation',
  async ({ id, quotationData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/quotations/${id}`, quotationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteQuotation = createAsyncThunk(
  'quotations/deleteQuotation',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/quotations/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const convertToInvoice = createAsyncThunk(
  'quotations/convertToInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/quotations/${id}/convert`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendQuotation = createAsyncThunk(
  'quotations/sendQuotation',
  async ({ id, emailData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/quotations/${id}/send`, emailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  quotations: [],
  loading: false,
  error: null,
};

const quotationSlice = createSlice({
  name: 'quotations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quotations
      .addCase(fetchQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = action.payload;
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch quotations';
      })
      // Create Quotation
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations.push(action.payload);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create quotation';
      })
      // Update Quotation
      .addCase(updateQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quotations.findIndex(quotation => quotation._id === action.payload._id);
        if (index !== -1) {
          state.quotations[index] = action.payload;
        }
      })
      .addCase(updateQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update quotation';
      })
      // Delete Quotation
      .addCase(deleteQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = state.quotations.filter(quotation => quotation._id !== action.payload);
      })
      .addCase(deleteQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete quotation';
      })
      // Convert to Invoice
      .addCase(convertToInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(convertToInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = state.quotations.filter(quotation => quotation._id !== action.payload._id);
      })
      .addCase(convertToInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to convert quotation to invoice';
      })
      // Send Quotation
      .addCase(sendQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quotations.findIndex(quotation => quotation._id === action.payload._id);
        if (index !== -1) {
          state.quotations[index] = action.payload;
        }
      })
      .addCase(sendQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send quotation';
      });
  },
});

export const { clearError } = quotationSlice.actions;
export default quotationSlice.reducer; 