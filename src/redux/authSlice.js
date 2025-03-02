// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        loading: true,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
          state.currentUser = action.payload;
          state.loading = false;
          state.error = null;
        },
        clearUser: (state) => {
          state.currentUser = null;
          state.loading = false;
          state.error = null;
        },
        setLoading: (state, action) => {
          state.loading = action.payload;
        }
    }
  }
);

// Action Creator Function for FirebaseAuthListener use
export const { setUser, clearUser, setLoading } = authSlice.actions;

export default authSlice.reducer;