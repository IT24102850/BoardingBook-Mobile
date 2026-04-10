import { configureStore } from '@reduxjs/toolkit';
import roommateReducer from './roommateSlice';

const store = configureStore({
  reducer: {
    roommate: roommateReducer,
  },
});

export default store;