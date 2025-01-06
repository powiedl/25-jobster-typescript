import {
  checkForUnauthorizedResponse,
  customFetch,
  returnError,
} from '@/utils/axios';
import { logoutUser, User } from './userSlice';
import { AxiosError } from 'axios';
import { clearAllJobsState } from '../allJobs/allJobsSlice';
import { clearValues } from '../job/jobSlice';

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerUserThunk = async (user: User, thunkAPI: any) => {
  try {
    //const response = await customFetch.post('/auth/testingRegister', {});
    const response = await customFetch.post('/auth/register', user);
    return response.data;
    //console.log(`Register User: ${JSON.stringify(user)}`);
    //console.log(response);
  } catch (error: AxiosError | Error | unknown) {
    if (error instanceof AxiosError) {
      // it can not be unauthorized, but the check also handles every other specific error of the API
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
    return returnError(error);
  }
};

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginUserThunk = async (user: User, thunkAPI: any) => {
  try {
    const response = await customFetch.post('/auth/login', user);
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    if (error instanceof AxiosError) {
      // it can not be unauthorized, but the check also handles every other specific error of the API
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
    return returnError(error);
  }
};

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserThunk = async (user: User, thunkAPI: any) => {
  try {
    const response = await customFetch.patch('/auth/updateUser', user);
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    if (error instanceof AxiosError) {
      // it can not be unauthorized, but the check also handles every other specific error of the API
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
    return returnError(error);
  }
};

// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearStoreThunk = async (_: any, thunkAPI: any) => {
  try {
    thunkAPI.dispatch(logoutUser());
    thunkAPI.dispatch(clearAllJobsState());
    thunkAPI.dispatch(clearValues());
    return Promise.resolve();
  } catch (error: AxiosError | Error | unknown) {
    if (error instanceof AxiosError) {
      console.log(error?.response?.statusText);
    }
    return Promise.reject();
  }
};
