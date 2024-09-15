import { createSlice } from '@reduxjs/toolkit';
import { fetchAllUser, createNewUser, updatedUser, deletedUser } from '../action/adminThunks'; 

const initialState = {
  admin: null,
  allUser: [], 
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.error = null; // Xóa lỗi khi bắt đầu fetch
      })
      .addCase(fetchAllUser.fulfilled, (state, action) => {
        state.allUser = action.payload;
      })
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.error = action.payload; 
      })
      // create user
      .addCase(createNewUser.pending, (state) => {
        state.error = null; 
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.allUser.push(action.payload); 
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.error = action.payload; 
      })
      // update user
      .addCase(updatedUser.pending, (state) => {
        state.error = null; 
      })
      .addCase(updatedUser.fulfilled, (state, action) => {
        const index = state.allUser.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.allUser[index] = action.payload;
        }
      })
      .addCase(updatedUser.rejected, (state, action) => {
        state.error = action.payload; 
      })
      // delete user
      .addCase(deletedUser.pending, (state) => {
        state.error = null; 
      })
      .addCase(deletedUser.fulfilled, (state, action) => {
        state.allUser = state.allUser.filter(user => user.id !== action.payload.id);
      })
      .addCase(deletedUser.rejected, (state, action) => {
        state.error = action.payload; 
      });
  },
});

export const { setAdmin } = adminSlice.actions; 
export default adminSlice.reducer;