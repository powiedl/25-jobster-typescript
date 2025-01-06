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
  return thunkAPI.rejectWithValue(
    (error?.response?.data as { msg: string })?.msg
  );
};

/**
 * Returns a descriptive error message from an AxiosError (?) instance.
 * If the error is an AxiosError with a response containing a data object which contains a msg string property,
 * it returns that message.
 * If it is a different AxiosError instance, it returns the message property.
 * Otherwise it returns a default error message ('Something went wrong').
 *
 * @param error - The error object to extract the message from.
 * @returns The error message string.
 */
export const returnError = (error: unknown) => {
  if (
    !!error &&
    typeof error === 'object' &&
    'response' in error &&
    !!error.response &&
    typeof error.response ==
      'object' /* error is an object with a repsonse object property */ &&
    'data' in error.response &&
    !!error.response.data &&
    typeof error.response.data ===
      'object' /* and within there is a data object property */ &&
    'msg' in error.response.data &&
    typeof error.response.data.msg ===
      'string' /* and within that there is a msg string property */
  ) {
    // error satisfies {response: {data: {msg: string}}}
    return error.response.data.msg;
  }

  if (error instanceof AxiosError) return error.message; // if it is a different AxiosError instance, return the message

  return 'Something went wrong'; // return a generic error message
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
