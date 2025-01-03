import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { Job, JobStatus, JobType } from '@/utils/types';
import { getAllJobsThunk, showStatsThunk } from './allJobsThunk';
import { ApiJobStatsType, ApiJobsType } from '@/utils/axios';

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
  searchType: JobType | All;
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
  filters: FiltersStateType;
  stats: {
    pending: number;
    interview: number;
    declined: number;
  };
  monthlyApplications: { date: string; count: number }[];
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

export const getAllJobs = createAsyncThunk<ApiJobsType, void>(
  'allJobs/getAllJobs',
  getAllJobsThunk
);

export const showStats = createAsyncThunk<ApiJobStatsType, void>(
  'allJobs/showStats',
  showStatsThunk
);

export const showLoading = createAction<void, 'allJobs/showLoading'>(
  'allJobs/showLoading'
);
export const hideLoading = createAction<void, 'allJobs/hideLoading'>(
  'allJobs/hideLoading'
);

const allJobsSlice = createSlice({
  name: 'allJobs',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllJobs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllJobs.fulfilled, (state, { payload }) => {
      const { jobs, totalJobs, numOfPages } = payload;
      // console.log('getAllJobs.fulfilled, payload=', payload);
      // console.log('getAllJobs.fulfilled, jobs=', jobs);
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
    builder.addCase(showStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(showStats.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.stats = payload.defaultStats;
      state.monthlyApplications = payload.monthlyApplications;
    });
    builder.addCase(showStats.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
  },
});

export default allJobsSlice.reducer;
