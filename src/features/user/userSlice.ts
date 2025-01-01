import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { customFetch } from '@/utils/axios';

type User = {
  name?: string;
  password: string;
  email: string;
  isMember?: boolean;
  token?: string;
};

interface UserState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  user: User | null;
}
const initialState: UserState = {
  isLoading: false,
  error: null,
  success: null,
  user: null,
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user: User, thunkAPI) => {
    try {
      //const response = await customFetch.post('/auth/testingRegister', {});
      const response = await customFetch.post('/auth/register', user);
      return response.data;
      //console.log(`Register User: ${JSON.stringify(user)}`);
      //console.log(response);
    } catch (error: AxiosError | Error | unknown) {
      // update the error state in the store (error.response.data.msg) ...
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || 'Something went wrong'
      );
    }
  }
);
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user: User, thunkAPI) => {
    try {
      //const response = await customFetch.post('/auth/testingRegister', {});
      const response = await customFetch.post('/auth/login', user);
      return response.data;
      //console.log(`Register User: ${JSON.stringify(user)}`);
      //console.log(response);
    } catch (error: AxiosError | Error | unknown) {
      // update the error state in the store (error.response.data.msg) ...
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || 'Something went wrong'
      );
    }

    console.log(`Login User: ${JSON.stringify(user)}`);
  }
);

export const clearMessages = createAction<void, 'user/clearMessages'>(
  'user/clearMessages'
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      const { user } = payload;
      state.isLoading = false;
      state.error = null;
      state.success = `Welcome ${user.name}`;
      state.user = user;
    });
    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      const { user } = payload;
      state.isLoading = false;
      state.error = null;
      state.success = `Welcome back ${user.name}`;
      state.user = user;
    });
    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
  },
});

export default userSlice.reducer;
