import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUser, createUser, updateUser, deleteUser } from '../../services/userService'; // Import hàm gọi API từ userService
import { toast } from 'react-toastify';
import { showLoading, hideLoading } from '../reducer/loadingSlice';
import { createBrand, getAllBrand, updateBrand, deleteBrand,
  createCategory, getAllCategory, updateCategory, deleteCategory,
  createType, getAllType, updateType, deleteType, 
  createProduct, getAllProduct, updateProduct, deleteProduct
 } from '../../services/productService';

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
      dispatch(showLoading());
      const response = await createUser(data); 
      dispatch(hideLoading());
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
      dispatch(showLoading());
      const response = await updateUser(id, data); 
      dispatch(hideLoading());
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
      await deleteUser(id); 
      toast.success('Xóa người dùng thành công');
      return {id};
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

// Brand

export const fetchAllBrand = createAsyncThunk(
  'admin/fetchAllBrand', 
  async (_, { rejectWithValue }) => { // Hàm bất đồng bộ để thực hiện hành động
    try {
      const response = await getAllBrand(); 
      return response.result; 
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage ;
      return rejectWithValue(errorMessage); 
    }
  }
);
export const createNewBrand = createAsyncThunk(
  'admin/createNewBrand', 
  async (data, { dispatch, rejectWithValue }) => { 
    try {
      dispatch(showLoading());
      const response = await createBrand(data); 
      dispatch(hideLoading());
      toast.success('Thêm thương hiệu thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || "thêm thương hiệu thất bại";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

export const updatedBrand = createAsyncThunk(
  "admin/updatedBrand",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const response = await updateBrand(id, data); 
      dispatch(hideLoading());
      toast.success('Cập nhật Thương hiệu thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

export const deletedBrand = createAsyncThunk(
  "admin/deletedBrand",
  async (id , { rejectWithValue }) => {
    try {
      await deleteBrand(id); 
      toast.success('Xóa Thươn hiệu thành công');
      return {id};
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

//category
export const fetchAllCategory = createAsyncThunk(
  'admin/fetchAllCategory', 
  async (_, { rejectWithValue }) => { // Hàm bất đồng bộ để thực hiện hành động
    try {
      const response = await getAllCategory(); 
      return response.result; 
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage ;
      return rejectWithValue(errorMessage); 
    }
  }
);
export const createNewCategory = createAsyncThunk(
  'admin/createNewCategory', 
  async (data, { dispatch, rejectWithValue }) => { 
    try {
      dispatch(showLoading());
      const response = await createCategory(data); 
      dispatch(hideLoading());
      toast.success('Thêm danh mục thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || "thêm danh mục thất bại";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

export const updatedCategory = createAsyncThunk(
  "admin/updatedCategory",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const response = await updateCategory(id, data); 
      dispatch(hideLoading());
      toast.success('Cập nhật danh mục thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

export const deletedCategory = createAsyncThunk(
  "admin/deletedCategory",
  async (id , { rejectWithValue }) => {
    try {
      await deleteCategory(id); 
      toast.success('Xóa danh mục thành công');
      return {id};
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

//type
export const fetchAllType = createAsyncThunk(
  'admin/fetchAllType', 
  async (_, { rejectWithValue }) => { // Hàm bất đồng bộ để thực hiện hành động
    try {
      const response = await getAllType(); 
      return response.result; 
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage ;
      return rejectWithValue(errorMessage); 
    }
  }
);

export const createNewType = createAsyncThunk(
  'admin/createNewType', 
  async (data, { dispatch, rejectWithValue }) => { 
    try {
      dispatch(showLoading());
      const response = await createType(data); 
      dispatch(hideLoading());
      toast.success('Thêm loại sản phẩm thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || "thêm loại sản phẩm thất bại";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

export const updatedType = createAsyncThunk(
  "admin/updatedType",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const response = await updateType(id, data); 
      dispatch(hideLoading());
      toast.success('Cập nhật loại sản phẩm thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

export const deletedType = createAsyncThunk(
"admin/deletedType",
  async (id , { rejectWithValue }) => {
    try {
      await deleteType(id); 
      toast.success('Xóa phân loại thành công');
      return {id};
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

//product
export const fetchAllProduct = createAsyncThunk(
  'admin/fetchAllProduct', 
  async (_, { rejectWithValue }) => { // Hàm bất đồng bộ để thực hiện hành động
    try {
      const response = await getAllProduct(); 
      return response.result; 
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage ;
      return rejectWithValue(errorMessage); 
    }
  }
);

export const createNewProduct = createAsyncThunk(
  'admin/createNewProduct', 
  async (data, { dispatch, rejectWithValue }) => { 
    try {
      dispatch(showLoading());
      const response = await createProduct(data); 
      dispatch(hideLoading());
      toast.success('Thêm sản phẩm thành công');
      return response.result;
    } catch (err) {
      dispatch(hideLoading());
      const errorResponse = err.response?.data?.responseException;
      let errorMessage = "Thêm sản phẩm thất bại";

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

export const updatedProduct = createAsyncThunk(
  "admin/updatedProduct",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const response = await updateProduct(id, data); 
      dispatch(hideLoading());
      toast.success('Cập sản phẩm hiệu thành công');
      return response.result;
    } catch (err) {
      const errorMessage = err.response?.data?.responseException?.exceptionMessage || 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); 
    }
  }
);

export const deletedProduct = createAsyncThunk(
  "admin/deletedProduct",
  async (id , { rejectWithValue }) => {
    try {
      await deleteProduct(id); 
      toast.success('Xóa sản phẩm thành công');
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