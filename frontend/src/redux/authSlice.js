import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAdmin: false,
    token: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAdmin = false;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
