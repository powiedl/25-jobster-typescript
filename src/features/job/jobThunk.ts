import {
  checkForUnauthorizedResponse,
  customFetch,
  returnError,
} from '@/utils/axios';
import { Job } from '@/utils/types';
import { AxiosError } from 'axios';
import { clearValues } from './jobSlice';
import { getAllJobs, showLoading } from '../allJobs/allJobsSlice';

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createJobThunk = async (job: Job, thunkAPI: any) => {
  try {
    const response = await customFetch.post('/jobs', job);
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    if (error instanceof AxiosError) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
    return returnError(error);
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
    if (error instanceof AxiosError) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
    return returnError(error);
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
    if (error instanceof AxiosError) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
    return returnError(error);
  }
};
