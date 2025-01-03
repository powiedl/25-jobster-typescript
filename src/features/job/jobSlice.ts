import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { customFetch } from '@/utils/axios';
import { Job, JobStatus, JobType } from '@/utils/types';
import { getUserFromLocalStorage } from '@/utils/localStorage';
import { RootState } from '@/store';
import { logoutUser } from '../user/userSlice';
import { showLoading, hideLoading, getAllJobs } from '../allJobs/allJobsSlice';

interface JobState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  job: Job;
  isEditing: boolean;
  editJobId: string | null;
}

const emptyJob: Job = {
  position: '',
  company: '',
  jobLocation: '',
  status: JobStatus.Pending,
  jobType: JobType.FullTime,
};

const initialState: JobState = {
  isLoading: false,
  error: null,
  success: null,
  job: emptyJob,
  isEditing: false,
  editJobId: null,
};

export const createJob = createAsyncThunk(
  'job/createJob',
  async (job: Job, thunkAPI) => {
    try {
      const response = await customFetch.post('/jobs', job, {
        headers: {
          authorization: `Bearer ${
            (thunkAPI.getState() as RootState).user.user?.token
          }`,
        },
      });
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
  }
);
export const editJob = createAsyncThunk(
  'job/editJob',
  async ({ jobId, job }: { jobId: string; job: Job }, thunkAPI) => {
    try {
      const response = await customFetch.patch<Job>(`/jobs/${jobId}`, job, {
        headers: {
          authorization: `Bearer ${
            (thunkAPI.getState() as RootState).user.user?.token
          }`,
        },
      });
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
  }
);

export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (jobId: string, thunkAPI) => {
    thunkAPI.dispatch(showLoading());
    try {
      const response = await customFetch.delete(`/jobs/${jobId}`, {
        headers: {
          authorization: `Bearer ${
            (thunkAPI.getState() as RootState).user.user?.token
          }`,
        },
      });
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
  }
);

export type HandleChangeParamsType = {
  name: 'position' | 'company' | 'jobLocation' | 'status' | 'jobType';
  value: string | JobStatus | JobType;
};

type SetEditJobParamsType = {
  editJobId: string;
  job: Job;
};

export const handleChange = createAction<
  HandleChangeParamsType,
  'job/handleChange'
>('job/handleChange');

export const clearValues = createAction<void, 'job/clearValues'>(
  'job/clearValues'
);
export const clearMessages = createAction<void, 'job/clearMessages'>(
  'job/clearMessages'
);
export const setEditJob = createAction<SetEditJobParamsType, 'job/setEditJob'>(
  'job/setEditJob'
);

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    handleChange: (
      state,
      {
        payload: { name, value },
      }: {
        payload: HandleChangeParamsType;
      }
    ) => {
      //state.job = {...state.job, [name]: value};
      if (name === 'position' || name === 'company' || name === 'jobLocation') {
        state.job[name] = value as string;
      } else if (name === 'status') {
        state.job[name] = value as JobStatus;
      } else if (name === 'jobType') {
        state.job[name] = value as JobType;
      }
    },
    clearValues: () => {
      return { ...initialState };
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    setEditJob: (state, { payload }: { payload: SetEditJobParamsType }) => {
      console.log('setEditJob, payload=', payload);
      const returnValue = {
        ...state,
        isEditing: true,
        editJobId: payload.editJobId,
      };
      returnValue.job = payload.job;
      return returnValue;
      //return { ...state, editJobId: payload.editJobId, isEditing: true, job: { payload.job } };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createJob.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createJob.fulfilled, (state, { payload }) => {
      const { job } = payload;
      state.isLoading = false;
      state.error = null;
      state.success = `Successfully created job: ${job.position}`;
      state.job = job;
    });
    builder.addCase(createJob.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
    builder.addCase(editJob.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(editJob.fulfilled, (state, { payload }) => {
      const { job } = payload;
      state.isLoading = false;
      state.error = null;
      state.success = `Successfully updated job: ${job.position}`;
      state.job = job;
    });
    builder.addCase(editJob.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
    // builder.addCase(deleteJob.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    builder.addCase(deleteJob.fulfilled, (state, { payload }) => {
      console.log('extraReducer,deleteJob.fulfilled,payload', payload);
      state.isLoading = false;
      state.error = null;
      state.success = payload as string;
    });
    builder.addCase(deleteJob.rejected, (state, { payload }) => {
      state.error = payload as string;
      state.success = null;
    });
  },
});

export default jobSlice.reducer;
