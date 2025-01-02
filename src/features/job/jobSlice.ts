import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { customFetch } from '@/utils/axios';
import { Job, JobStatus, JobMode } from '@/utils/types';
import { getUserFromLocalStorage } from '@/utils/localStorage';

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

export type HandleChangeParamsType = {
  name: 'position' | 'company' | 'location' | 'status' | 'mode';
  value: string | JobStatus | JobMode;
};

export const handleChange = createAction<
  HandleChangeParamsType,
  'job/handleChange'
>('job/handleChange');
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
  },
});

export default jobSlice.reducer;
