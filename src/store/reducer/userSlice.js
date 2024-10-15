import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import { loginApiService } from '../../services/userService'; 
import { decodeToken, isTokenExpired } from '../../services/tokenService'; 
import { toast } from 'react-toastify';
import { showLoading, hideLoading } from './loadingSlice'; // Import các hành động loading
import { getUserById, getAddressById } from '../action/userThunks';


export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { dispatch, rejectWithValue }) => { // Thêm dispatch vào tham số
    try {
      dispatch(showLoading());

      const response = await loginApiService(email, password);

      dispatch(hideLoading());
      return response; 
    } catch (err) {
      dispatch(hideLoading());
      const errorMessage = err.response?.data?.responseException?.exceptionMessage;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);


const userSlice = createSlice({
  name: 'user', 
  initialState: {
    isLoggedIn: false, 
    userInfo: null, 
    error: '', 
    accessToken: null,
    address: [],
    isLoading: false, 
    //
  },
  reducers: {   
    logout(state) { 
      state.isLoggedIn = false; 
      state.userInfo = null; 
      state.accessToken = null; 
      state.error = ''; 
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {  
    builder
      .addCase(loginUser.pending, (state) => { // Khi hành động login đang xử lý (đang chờ)
        state.isLoading = true; 
        state.error = ''; 
      })
      .addCase(loginUser.fulfilled, (state, action) => { 
        const token = action.payload.result.token; 
        
        // Kiểm tra nếu token hết hạn
        if (isTokenExpired(token)) { 
          state.error = 'Token has expired.';
          state.isLoading = false; // Ngừng trạng thái loading
          return; 
        }

        // Giải mã token 
        const decodedToken = decodeToken(token); 

        state.isLoggedIn = true;
        state.userInfo = decodedToken; 
        state.accessToken = token;
        state.error = ''; 
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => { // Khi hành động login bị từ chối
        state.isLoggedIn = false; 
        state.userInfo = null; 
        state.accessToken = null;
        state.error = action.payload || 'Login failed. Please check your credentials.';
        state.isLoading = false; 
      })

      .addCase(getUserById.pending, (state) => {
        state.isLoading = true; 
        state.error = ''; 
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        // Cập nhật userInfo với dữ liệu lấy từ API
        state.userInfo = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch user information.';
        state.isLoading = false;
      })

      .addCase(getAddressById.pending, (state) => {
        state.isLoading = true; 
        state.error = ''; 
      })
      .addCase(getAddressById.fulfilled, (state, action) => {
        state.address = action.payload;
        state.isLoading = false;
      })
      .addCase(getAddressById.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch user information.';
        state.isLoading = false;
      });
  },
});

export const { logout } = userSlice.actions; 
export default userSlice.reducer;