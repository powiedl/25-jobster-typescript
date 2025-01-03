import axios, { AxiosError } from 'axios';
import { Job } from './types';
import { getUserFromLocalStorage } from './localStorage';
import { logoutUser } from '@/features/user/userSlice';

export const customFetch = axios.create({
  baseURL: 'https://redux-toolkit-jobster-api-server.onrender.com/api/v1',
});

customFetch.interceptors.request.use(
  (config) => {
    const user = getUserFromLocalStorage();
    if (user) {
      // wenn ein User gefunden wurde, dessen Token als Authorization Header hinzufügen
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // wenn etwas schief geht Promise rejecten
  }
);

export const checkForUnauthorizedResponse = (
  error: AxiosError,
  // I was not able to figure out what type to use for thunkAPI
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thunkAPI: any
) => {
  if (error?.response?.status === 401) {
    thunkAPI.dispatch(logoutUser());
    return thunkAPI.rejectWithValue('Unauthorized! Logging out ...');
  }
  return thunkAPI.rejectWithValue(error?.response?.data?.msg);
};

export interface ApiJobsType {
  jobs: Job[];
  totalJobs: number;
  numOfPages: number;
}

export interface ApiJobStatsType {
  defaultStats: {
    pending: number;
    interview: number;
    declined: number;
  };
  monthlyApplications: { date: string; count: number }[];
}
