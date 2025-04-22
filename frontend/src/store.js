// store/index.js or store.js
import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice'; // or wherever your auth slice is

const store = configureStore({
  reducer: {
    // auth: authReducer,
  },
});

export default store;
