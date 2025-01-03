import { customFetch } from '@/utils/axios';
import { Job } from '@/utils/types';
import { type AxiosError } from 'axios';
import { logoutUser } from '../user/userSlice';
import { clearValues } from './jobSlice';
import { getAllJobs, hideLoading, showLoading } from '../allJobs/allJobsSlice';

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createJobThunk = async (job: Job, thunkAPI: any) => {
  try {
    const response = await customFetch.post('/jobs', job);
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    if (error?.response?.status === 401) {
      console.log('createJob, ERROR', error);
      thunkAPI.dispatch(logoutUser());
      return thunkAPI.rejectWithValue('Unauthorized! Logging out ...');
    } else {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || 'Something went wrong'
      );
    }
  }
};

export const editJobThunk = async (
  { jobId, job }: { jobId: string; job: Job },
  // I was not able to figure out what type to use for thunkAPI
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thunkAPI: any
) => {
  try {
    const response = await customFetch.patch<Job>(`/jobs/${jobId}`, job);
    thunkAPI.dispatch(clearValues());
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    console.log('editJob, ERROR', error);
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

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteJobThunk = async (jobId: string, thunkAPI: any) => {
  thunkAPI.dispatch(showLoading());
  try {
    const response = await customFetch.delete(`/jobs/${jobId}`);
    thunkAPI.dispatch(getAllJobs());
    console.log('deleteJob, thunk, response.data=', response.data);
    return response.data.msg;
  } catch (error: AxiosError | Error | unknown) {
    console.log('deleteJob, ERROR', error);
    thunkAPI.dispatch(hideLoading());
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
