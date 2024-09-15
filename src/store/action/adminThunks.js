import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUser, createUser, updateUser, deleteUser } from '../../services/userService'; // Import hàm gọi API từ userService
import { toast } from 'react-toastify';

export const fetchAllUser = createAsyncThunk(
  'admin/fetchAllUser', 
  async (_, { rejectWithValue }) => { // Hàm bất đồng bộ để thực hiện hành động
    try {
      const response = await getAllUser(); 
      return response.result; // Trả về mảng người dùng
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage ;
      return rejectWithValue(errorMessage); 
    }
  }
);

export const createNewUser = createAsyncThunk(
  'admin/createNewUser', 
  async (data, { dispatch, rejectWithValue }) => { 
    try {
      const response = await createUser(data); 
      toast.success('Thêm người dùng thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);



const updatedUser = createAsyncThunk(
  "admin/updatedUser",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateUser(id, data); 
      toast.success('Cập nhật người dùng thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

const deletedUser = createAsyncThunk(
  "admin/deleteUser",
  async (id , { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteUser(id); 
      toast.success('Xóa người dùng thành công');
      return {id};
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

export {
  updatedUser,
  deletedUser
}