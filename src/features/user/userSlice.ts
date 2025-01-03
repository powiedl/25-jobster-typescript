import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { customFetch } from '@/utils/axios';
import {
  getUserFromLocalStorage,
  addUserToLocalStorage,
  removeUserFromLocalStorage,
} from '@/utils/localStorage';

export type User = {
  name?: string;
  password: string;
  email: string;
  isMember?: boolean;
  token?: string;
  lastName?: string;
  location?: string;
};

interface UserState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isSidebarOpen?: boolean;
  user: User | null;
}
const initialState: UserState = {
  isLoading: false,
  error: null,
  success: null,
  isSidebarOpen: window.innerWidth > 1024 ? true : false,
  user: getUserFromLocalStorage(),
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
      const response = await customFetch.post('/auth/login', user);
      return response.data;
    } catch (error: AxiosError | Error | unknown) {
      // update the error state in the store (error.response.data.msg) ...
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || 'Something went wrong'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: User, thunkAPI) => {
    try {
      const response = await customFetch.patch('/auth/updateUser', user);
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

export const clearMessages = createAction<void, 'user/clearMessages'>(
  'user/clearMessages'
);

export const toggleSidebar = createAction<void, 'user/toggleSidebar'>(
  'user/toggleSidebar'
);

export const logoutUser = createAction<void, 'user/logoutUser'>(
  'user/logoutUser'
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    toggleSidebar: (state) => {
      //console.log('toggleSidebar action');
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state) => {
      removeUserFromLocalStorage();
      state.user = null;
      state.isSidebarOpen = false;
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
      addUserToLocalStorage(user);
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
      addUserToLocalStorage(user);
      state.user = user;
    });
    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      const { user } = payload;
      state.isLoading = false;
      state.error = null;
      state.success = `Profile updated`;
      addUserToLocalStorage(user);
      state.user = user;
    });
    builder.addCase(updateUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
  },
});

export default userSlice.reducer;
