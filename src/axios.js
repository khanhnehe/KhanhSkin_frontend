import axios from 'axios';

// Tạo instance của axios với cấu hình cơ bản
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5054', // Đảm bảo baseURL đúng
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để thêm token vào mỗi request nếu cần
instance.interceptors.request.use(
    config => {
        // Lấy token từ localStorage hoặc nơi bạn lưu trữ
        const persistedState = localStorage.getItem('persist:user');
        if (persistedState) {
            const { accessToken } = JSON.parse(persistedState);
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken.replace(/"/g, '')}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý response
instance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;