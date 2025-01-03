import { ApiJobStatsType, ApiJobsType, customFetch } from '@/utils/axios';
import { AxiosError } from 'axios';
import { logoutUser } from '../user/userSlice';

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllJobsThunk = async (_, thunkAPI: any) => {
  let url = '/jobs';
  url = '/jobs'; // to make typescript happy ... we will modify it later on
  try {
    const response = await customFetch.get<ApiJobsType>(url);
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    // update the error state in the store (error.response.data.msg) ...
    if (error?.response?.status === 401) {
      thunkAPI.dispatch(logoutUser());
      return thunkAPI.rejectWithValue('Unauthorized! Logging out ...');
    } else {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || 'Something went wrong'
      );
    }
  }
};

export const showStatsThunk = async (_, thunkAPI: any) => {
  try {
    const response = await customFetch.get<ApiJobStatsType>('/jobs/stats');
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    // update the error state in the store (error.response.data.msg) ...
    if (error?.response?.status === 401) {
      thunkAPI.dispatch(logoutUser());
      return thunkAPI.rejectWithValue('Unauthorized! Logging out ...');
    } else {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || 'Something went wrong'
      );
    }
  }
};
