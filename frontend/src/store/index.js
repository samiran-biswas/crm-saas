import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import taskReducer from './slices/taskSlice';
import meetingReducer from './slices/meetingSlice';
import projectReducer from './slices/projectSlice';
import leadReducer from './slices/leadSlice';
import customerReducer from './slices/customerSlice';
import employeeReducer from './slices/employeeSlice';
import ticketReducer from './slices/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    tasks: taskReducer,
    meetings: meetingReducer,
    projects: projectReducer,
    leads: leadReducer,
    customers: customerReducer,
    employees: employeeReducer,
    tickets: ticketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 