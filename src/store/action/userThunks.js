import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUser, createUser, updateUser, deleteUser, getUserId, createAddress, updateAddress, deleteAddress, getAddressId,
    
    getOrdersByUser,changeStatus, createReview,getReviewProduct, getRecommendations,
    getVoucherActive, changePassword, searchProduct, userFavorites, toggleFavorite,
    register, conditionVoucher, updateUserById
 } from '../../services/userService';
import { toast } from 'react-toastify';
import { showLoading, hideLoading } from '../reducer/loadingSlice';
import { loginUser } from '../reducer/userSlice';

export const getUserById = createAsyncThunk(
    'user/getUserById', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await getUserId(input);    
            dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

export const searchProducts = createAsyncThunk(
    'user/searchProducts',
    async (keyword, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await searchProduct(keyword);
            dispatch(hideLoading());
            return response.result;
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi tìm kiếm sản phẩm';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const getAddressById = createAsyncThunk(
    'user/getAddressById', 
    async (_, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await getAddressId();    
            dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin địa chỉ';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

export const changePasswordUser = createAsyncThunk(
    'user/changePasswordUser',
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await changePassword(input);
            dispatch(hideLoading());
            toast.success('Thay đổi mật khẩu thành công');
            // dispatch(getAddressById()); 
            return response.result;
        } catch (err) {
            dispatch(hideLoading());
            const errorResponse = err.response?.data?.responseException;
            let errorMessage = "Đổi mật khẩu thất bại";
      
            if (errorResponse) {
              if (typeof errorResponse.exceptionMessage === 'string') {
                errorMessage = errorResponse.exceptionMessage;
              } else if (errorResponse.errors) {
                errorMessage = Object.values(errorResponse.errors).flat().join(' ');
              }
            }
      
            toast.error(errorMessage);
            return rejectWithValue(errorMessage); 
          }
    }
);

export const createNewAddress = createAsyncThunk(
    'user/createNewAddress',
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await createAddress(input);
            dispatch(hideLoading());
            toast.success('Địa chỉ được tạo thành công');
            dispatch(getAddressById()); 
            return response.result;
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi tạo địa chỉ';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const updatedAddress = createAsyncThunk(
    'user/updatedAddress',
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await updateAddress(id, data);
            dispatch(hideLoading());
            toast.success('Địa chỉ được cập nhật thành công');
            dispatch(getAddressById()); 
            return response.result;
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi cập nhật địa chỉ';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const deletedAddress = createAsyncThunk(
    'user/deletedAddress',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            await deleteAddress(id);
            dispatch(hideLoading());
            toast.success('Địa chỉ đã được xóa thành công');
            dispatch(getAddressById()); 
            return {id};
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi xóa địa chỉ';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);


export const getOrderByUser = createAsyncThunk(
    'user/getOrderByUser', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await getOrdersByUser(input);    
            dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

export const changeStatusOrder = createAsyncThunk(
    'user/changeStatusOrder', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            // dispatch(showLoading());
            const response = await changeStatus(input);    
            // dispatch(hideLoading());
            toast.success('Đơn hàng đã cập nhật trạng thái');
            dispatch(getOrderByUser({ filter: input.filter, orderStatus: input.orderStatus })); 
            return response.result;   
        } catch (err) {
            // dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

export const createdReview = createAsyncThunk(
    'user/createdReview', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await createReview(input);    
            dispatch(hideLoading());
            toast.success('Đơn hàng đã cập nhật trạng thái');
            dispatch(getOrderByUser({ filter: input.filter, orderStatus: input.orderStatus })); 
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);
export const getReviewsProduct= createAsyncThunk(
    'user/getReviewsProduct', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            // dispatch(showLoading());
            const response = await getReviewProduct(input);    
            // dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            // dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);


export const getRecommendProduct= createAsyncThunk(
    'user/getRecommendProduct', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            // dispatch(showLoading());
            const response = await getRecommendations(input);    
            // dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            // dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

export const getVouchersActive = createAsyncThunk(
    'user/getVouchersActive', 
    async (_, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await getVoucherActive();    
            dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin địa chỉ';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

export const userFavorite = createAsyncThunk(
    'user/userFavorite', 
    async (_, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await userFavorites();    
            dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

export const toggleFavoriteProduct = createAsyncThunk(
    'user/toggleFavoriteProduct', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await toggleFavorite(input);    
            dispatch(hideLoading());
            // toast.success('Đã thêm vào yêu thích');
            dispatch(userFavorite()); 
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/registerUser', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await register(input);    
            toast.success('Đăng ký thành công');
            dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorResponse = err.response?.data?.responseException;
            let errorMessage = "Đăng ký thất bại";
            if (errorResponse) {
              if (typeof errorResponse.exceptionMessage === 'string') {
                errorMessage = errorResponse.exceptionMessage;
              } else if (errorResponse.errors) {
                errorMessage = Object.values(errorResponse.errors).flat().join(' ');
              }
            }
      
            toast.error(errorMessage);
            return rejectWithValue(errorMessage); 
          }
    }
);


export const conditionOfVoucher= createAsyncThunk(
    'user/conditionOfVoucher', 
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(showLoading());
            const response = await conditionVoucher(input);    
            dispatch(hideLoading());
            return response.result;   
        } catch (err) {
            dispatch(hideLoading());
            const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra khi lấy thông tin người dùng';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);


