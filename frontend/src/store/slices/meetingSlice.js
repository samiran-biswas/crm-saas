import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/meetings');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch meetings');
    }
  }
);

export const createMeeting = createAsyncThunk(
  'meetings/createMeeting',
  async (meetingData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/meetings', meetingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to create meeting');
    }
  }
);

export const updateMeeting = createAsyncThunk(
  'meetings/updateMeeting',
  async ({ id, ...meetingData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/meetings/${id}`, meetingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to update meeting');
    }
  }
);

export const deleteMeeting = createAsyncThunk(
  'meetings/deleteMeeting',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/meetings/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to delete meeting');
    }
  }
);

export const addMeetingNote = createAsyncThunk(
  'meetings/addNote',
  async ({ meetingId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/meetings/${meetingId}/notes`, { content });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to add note');
    }
  }
);

export const updateParticipantStatus = createAsyncThunk(
  'meetings/updateParticipantStatus',
  async ({ meetingId, userId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/meetings/${meetingId}/participants/${userId}`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to update participant status');
    }
  }
);

// Slice
const meetingSlice = createSlice({
  name: 'meetings',
  initialState: {
    meetings: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Meetings
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Meeting
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings.push(action.payload);
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Meeting
      .addCase(updateMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meetings.findIndex(meeting => meeting._id === action.payload._id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      })
      .addCase(updateMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Meeting
      .addCase(deleteMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = state.meetings.filter(meeting => meeting._id !== action.payload);
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Note
      .addCase(addMeetingNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMeetingNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meetings.findIndex(meeting => meeting._id === action.payload._id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      })
      .addCase(addMeetingNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Participant Status
      .addCase(updateParticipantStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParticipantStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meetings.findIndex(meeting => meeting._id === action.payload._id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      })
      .addCase(updateParticipantStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = meetingSlice.actions;
export default meetingSlice.reducer; 