import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApiService } from '../../services/userService';
import { decodeToken, isTokenExpired } from '../../services/tokenService'; // Import các tiện ích token

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginApiService(email, password);
      return response; // Không cần `response.data` vì interceptor đã xử lý
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Login failed');
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
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const token = action.payload.result.token; // Giả sử token có trong result
        
        // Kiểm tra nếu token hết hạn
        if (isTokenExpired(token)) {
          state.error = 'Token has expired.';
          state.isLoading = false;
          return;
        }

        // Giải mã token và lấy thông tin người dùng
        const decodedToken = decodeToken(token);

        state.isLoggedIn = true;
        state.userInfo = decodedToken; // Lưu thông tin người dùng đã giải mã
        state.accessToken = token; // Lưu token
        state.error = '';
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
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
