import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { Job, JobStatus, JobType } from '@/utils/types';
import { createJobThunk, editJobThunk, deleteJobThunk } from './jobThunk';

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

export const createJob = createAsyncThunk('job/createJob', createJobThunk);
export const editJob = createAsyncThunk('job/editJob', editJobThunk);
export const deleteJob = createAsyncThunk('job/deleteJob', deleteJobThunk);

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
