import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { customFetch } from '@/utils/axios';
import { Job, JobStatus, JobMode } from '@/utils/types';
import { getUserFromLocalStorage } from '@/utils/localStorage';
import { RootState } from '@/store';
import { logoutUser } from '../user/userSlice';

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
  location: '',
  status: JobStatus.Pending,
  mode: JobMode.FullTime,
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
    console.log('Creating job (Begin of AsyncThunk)...', job);
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
  name: 'position' | 'company' | 'location' | 'status' | 'mode';
  value: string | JobStatus | JobMode;
};

export const handleChange = createAction<
  HandleChangeParamsType,
  'job/handleChange'
>('job/handleChange');

export const clearValues = createAction<void, 'job/clearValues'>(
  'job/clearValues'
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
      if (name === 'position' || name === 'company' || name === 'location') {
        state.job[name] = value as string;
      } else if (name === 'status') {
        state.job[name] = value as JobStatus;
      } else if (name === 'mode') {
        state.job[name] = value as JobMode;
      }
    },
    clearValues: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createJob.pending, (state) => {
      console.log('Creating job (state pending)...', state);
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createJob.fulfilled, (state, { payload }) => {
      const { job } = payload;
      console.log('Creating job (state fulfilled)...', job);
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
  },
});

export default jobSlice.reducer;
