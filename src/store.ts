import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import jobSlice from './features/job/jobSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    job: jobSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
