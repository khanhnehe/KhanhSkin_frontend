import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import { loginApiService } from '../../services/userService'; 
import { decodeToken, isTokenExpired } from '../../services/tokenService'; 
import { toast } from 'react-toastify';
import { showLoading, hideLoading } from './loadingSlice'; // Import các hành động loading

// Hàm bất đồng bộ dùng để login người dùng, sử dụng createAsyncThunk để xử lý các side effect
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { dispatch, rejectWithValue }) => { // Thêm dispatch vào tham số
    try {
      dispatch(showLoading()); // Hiển thị loading spinner

      // Tạo một Promise để đảm bảo loading spinner hiển thị ít nhất 2 giây
      const minimumLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));

      // Gọi API login
      const responsePromise = loginApiService(email, password);

      // Chờ cả hai Promise hoàn thành
      const [response] = await Promise.all([responsePromise, minimumLoadingTime]);

      dispatch(hideLoading()); // Ẩn loading spinner
      return response; 
    } catch (err) {
      dispatch(hideLoading()); // Ẩn loading spinner nếu có lỗi
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Login failed';
      toast.error(errorMessage); // Hiển thị thông báo lỗi bằng toast
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
    isLoading: false, 
  },
  reducers: { // Các reducer để xử lý các hành động đồng bộ
    logout(state) { 
      state.isLoggedIn = false; 
      state.userInfo = null; 
      state.accessToken = null; 
      state.error = ''; 
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => { // Xử lý các hành động bất đồng bộ
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
      });
  },
});

export const { logout } = userSlice.actions; 
export default userSlice.reducer;