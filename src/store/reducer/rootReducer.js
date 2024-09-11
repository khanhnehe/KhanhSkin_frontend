import { combineReducers } from 'redux';
import userReducer from '../reducer/userSlice';
import adminReducer from '../reducer/adminReducer';

const rootReducer = (history) => combineReducers({
  user: userReducer,
  admin: adminReducer,
  // Thêm các reducer khác nếu có
});

export default rootReducer;