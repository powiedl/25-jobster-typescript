import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import {
  getUserFromLocalStorage,
  addUserToLocalStorage,
  removeUserFromLocalStorage,
} from '@/utils/localStorage';
import {
  loginUserThunk,
  registerUserThunk,
  updateUserThunk,
  clearStoreThunk,
} from './userThunk';

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
  registerUserThunk
);

export const loginUser = createAsyncThunk('user/loginUser', loginUserThunk);

export const updateUser = createAsyncThunk('user/updateUser', updateUserThunk);

export const clearStore = createAsyncThunk<void, void>(
  'user/clearStore',
  clearStoreThunk
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
    builder.addCase(clearStore.rejected, (state) => {
      state.error = 'There was an error ...';
    });
  },
});

export default userSlice.reducer;
