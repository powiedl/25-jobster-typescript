import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { ApiJobsType, customFetch } from '@/utils/axios';
import { Job, JobStatus, JobMode } from '@/utils/types';
import { getUserFromLocalStorage } from '@/utils/localStorage';
import { RootState } from '@/store';
import { logoutUser } from '../user/userSlice';

enum FilterSortType {
  latest = 'latest',
  oldest = 'oldest',
  aToZ = 'a-z',
  zToA = 'z-a',
}

enum All {
  all = 'all',
}

type FiltersStateType = {
  search: string;
  searchStatus: JobStatus | All;
  searchType: JobMode | All;
  sort: FilterSortType;
};

type allJobsStateType = {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  jobs: Job[];
  totalJobs: number;
  numOfPages: number;
  page: number;
  stats: {
    pending: number;
    interview: number;
    declined: number;
  };
  monthlyApplications: number[];
  filters: FiltersStateType;
};

const initialState: allJobsStateType = {
  isLoading: true,
  error: null,
  success: null,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {
    pending: 0,
    interview: 0,
    declined: 0,
  },
  monthlyApplications: [],
  filters: {
    search: '',
    searchStatus: All.all,
    searchType: All.all,
    sort: FilterSortType.latest,
  },
};

export const getAllJobs = createAsyncThunk(
  'allJobs/getAllJobs',
  async (_, thunkAPI) => {
    let url = '/jobs';
    url = '/jobs'; // to make typescript happy ... we will modify it later on
    try {
      const response = await customFetch.get<ApiJobsType>(url, {
        headers: {
          authorization: `Bearer ${
            (thunkAPI.getState() as RootState).user.user?.token
          }`,
        },
      });
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
  }
);

const allJobsSlice = createSlice({
  name: 'allJobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllJobs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllJobs.fulfilled, (state, { payload }) => {
      const { jobs, totalJobs, numOfPages } = payload;
      state.isLoading = false;
      state.error = null;
      state.success = null;
      state.jobs = jobs;
      state.totalJobs = totalJobs;
      state.numOfPages = numOfPages;
    });
    builder.addCase(getAllJobs.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
  },
});

export default allJobsSlice.reducer;
