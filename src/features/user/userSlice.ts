import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type User = {
  name?: string;
  password: string;
  email: string;
  isMember?: boolean;
};

interface UserState {
  isLoading: boolean;
  user: User | null;
}
const initialState: UserState = {
  isLoading: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user: User, thunkAPI) => {
    console.log(`Register User: ${JSON.stringify(user)}`);
  }
);
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user: User, thunkAPI) => {
    console.log(`Login User: ${JSON.stringify(user)}`);
  }
);

export default userSlice.reducer;
