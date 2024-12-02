import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApiService, updateUserById } from '../../services/userService';
import { decodeToken, isTokenExpired } from '../../services/tokenService';
import { toast } from 'react-toastify';
import { showLoading, hideLoading } from './loadingSlice'; // Import các hành động loading
import {
  getUserById, getAddressById, getOrderByUser, getReviewsProduct, getRecommendProduct, getVouchersActive,
  searchProducts, userFavorite, conditionOfVoucher
} from '../action/userThunks';




export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
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

export const updateUserId = createAsyncThunk(
  'user/updateUserId',
  async (input, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(showLoading());

      const response = await updateUserById(input);

      // Lấy thông tin user hiện tại từ state
      const currentState = getState().user;

      // Kết hợp thông tin user mới với thông tin hiện tại
      const updatedUserInfo = {
        ...currentState.userInfo,
        ...response.result,
      };

      dispatch({
        type: 'user/updateUserInfo',
        payload: updatedUserInfo,
      });

      dispatch(hideLoading());
      toast.success('Cập nhật thông tin thành công!');
      return response.result;
    } catch (err) {
      dispatch(hideLoading());
      const errorMessage =
        err.response?.data?.responseException?.exceptionMessage ||
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
    orderUser: [],
    reviewProduct: [],
    productRecommend: [],
    voucherActive: [],
    searchProduct: [],
    userFavorite: [],
    infoVoucher: [],
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
    updateUserInfo(state, action) {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const token = action.payload.result.token;

        if (isTokenExpired(token)) {
          state.error = 'Token has expired.';
          state.isLoading = false;
          return;
        }

        const decodedToken = decodeToken(token);

        state.isLoggedIn = true;
        state.userInfo = decodedToken;
        state.accessToken = token;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.accessToken = null;
        state.error = action.payload || 'Login failed. Please check your credentials.';
        state.isLoading = false;
      })
      // update
      .addCase(updateUserId.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(updateUserId.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, ...action.payload };
        state.isLoading = false;
      })
      .addCase(updateUserId.rejected, (state, action) => {
        state.error = action.payload || 'Cập nhật thông tin thất bại.';
        state.isLoading = false;
      })
///



      //-------------------
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        // Cập nhật userInfo với dữ liệu lấy từ API
        state.userInfo = {
          ...state.userInfo,
          ...action.payload,
        }; state.isLoading = false;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch user information.';
        state.isLoading = false;
      })

      //
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
      })
      //
      .addCase(getOrderByUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getOrderByUser.fulfilled, (state, action) => {
        state.orderUser = action.payload.items;
        state.totalRecord = action.payload.totalRecord;
      })
      .addCase(getOrderByUser.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch user information.';
        state.isLoading = false;
      });

    //
    builder
      .addCase(getReviewsProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(getReviewsProduct.fulfilled, (state, action) => {
        state.reviewProduct = action.payload.items;
        state.totalRecord = action.payload.totalRecord;
      })
      .addCase(getReviewsProduct.rejected, (state, action) => {
        state.error = action.payload;
      });

    //
    builder
      .addCase(getRecommendProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(getRecommendProduct.fulfilled, (state, action) => {
        state.productRecommend = action.payload.result;
      })
      .addCase(getRecommendProduct.rejected, (state, action) => {
        state.error = action.payload;
      });

    //
    builder
      .addCase(getVouchersActive.pending, (state) => {
        state.error = null;
      })
      .addCase(getVouchersActive.fulfilled, (state, action) => {
        state.voucherActive = action.payload;
      })
      .addCase(getVouchersActive.rejected, (state, action) => {
        state.error = action.payload;
      });
      //
    builder
      .addCase(searchProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchProduct = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.error = action.payload;
      });

      //
    builder
      .addCase(userFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(userFavorite.fulfilled, (state, action) => {
        state.userFavorite = action.payload.data;
      })
      .addCase(userFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
      //

      builder
      .addCase(conditionOfVoucher.pending, (state) => {
        state.error = null;
      })
      .addCase(conditionOfVoucher.fulfilled, (state, action) => {
        state.infoVoucher = action.payload;
      })
      .addCase(conditionOfVoucher.rejected, (state, action) => {
        state.error = action.payload;
      });


  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;