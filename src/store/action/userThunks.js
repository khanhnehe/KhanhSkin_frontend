import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUser, createUser, updateUser, deleteUser, getUserId, createAddress, updateAddress, deleteAddress, getAddressId } from '../../services/userService';
import { toast } from 'react-toastify';
import { showLoading, hideLoading } from '../reducer/loadingSlice';

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