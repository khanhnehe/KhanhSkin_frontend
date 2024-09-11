import { jwtDecode } from 'jwt-decode';

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.exp) {
    return true; // Token không hợp lệ hoặc không có thông tin hết hạn
  }

  const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
  return decodedToken.exp < currentTime; // Token đã hết hạn nếu exp nhỏ hơn thời gian hiện tại
};

export { decodeToken, isTokenExpired };
