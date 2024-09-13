import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from '../reducer/userSlice';
import adminSlice from '../reducer/adminSlice';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import loadingSlice from '../reducer/loadingSlice';
// Cấu hình lưu trữ cho reducer 'user'
const userPersistConfig = {
  key: 'user',
  storage,
  stateReconciler: autoMergeLevel2, // Giúp hợp nhất các thay đổi trong state mà không ghi đè hoàn toàn
  whitelist: ['isLoggedIn', 'userInfo', 'accessToken'], // Chỉ lưu trữ các trường cụ thể
};

// Cấu hình lưu trữ cho reducer 'admin'
const adminPersistConfig = {
  key: 'admin',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['infoProduct'], // Chỉ lưu trữ các trường cụ thể
};

// Kết hợp các reducer, trong đó mỗi reducer được bọc bởi persistReducer riêng
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userSlice),
  admin: persistReducer(adminPersistConfig, adminSlice),
  loading: loadingSlice,
});

export default rootReducer;
