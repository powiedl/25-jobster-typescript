import {
  ApiJobStatsType,
  ApiJobsType,
  checkForUnauthorizedResponse,
  customFetch,
  returnError,
} from '@/utils/axios';
import { AxiosError } from 'axios';

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllJobsThunk = async (_: any, thunkAPI: any) => {
  let url = '/jobs';
  const state = thunkAPI.getState().allJobs;
  const { search, searchStatus, searchType, sort } = state.filters;
  const { page } = state;
  url += `?status=${searchStatus}&jobType=${searchType}&sort=${sort}&page=${page}`;
  if (search) url += `&search=${search}`;
  console.log('getAllJobsThunk, url=', url);
  try {
    const response = await customFetch.get<ApiJobsType>(url);
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    if (error instanceof AxiosError) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
    return returnError(error);
  }
};

// I was not able to figure out what type to use for thunkAPI (and the unused _ parameter)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showStatsThunk = async (_: any, thunkAPI: any) => {
  try {
    const response = await customFetch.get<ApiJobStatsType>('/jobs/stats');
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    if (error instanceof AxiosError) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
    return returnError(error);
  }
};
