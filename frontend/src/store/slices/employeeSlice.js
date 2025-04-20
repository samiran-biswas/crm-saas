import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/employees');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEmployee = createAsyncThunk('employees/fetchEmployee', async (id) => {
  const response = await axios.get(`/employees/${id}`);
  return response.data;
});

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePermissions = createAsyncThunk(
  'employees/updatePermissions',
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/employees/${id}/permissions`, { permissions });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
};

// Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch employees';
      })
      // Fetch single employee
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create employee';
      })
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp._id === action.payload._id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?._id === action.payload._id) {
          state.currentEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update employee';
      })
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(emp => emp._id !== action.payload);
        if (state.currentEmployee?._id === action.payload) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete employee';
      })
      // Update permissions
      .addCase(updatePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermissions.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp._id === action.payload._id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?._id === action.payload._id) {
          state.currentEmployee = action.payload;
        }
      })
      .addCase(updatePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update permissions';
      });
  },
});

export const { clearError, clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer; 