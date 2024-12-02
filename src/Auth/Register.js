import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/action/userThunks';
import { useNavigate } from 'react-router-dom';
import './Register.scss'; // Import SCSS file

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 1, // Default role
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await dispatch(registerUser(newUser)).unwrap(); // unwrap để xử lý kết quả
      navigate('/sign-in'); // Chuyển hướng đến trang đăng nhập
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
    //   setErrorMessage(error.message || 'Đăng ký thất bại!'); // Hiển thị lỗi
    }
  };

  return (
    <div className="register-background">
      <div className="register">
        <h2 className="login-title">Đăng Ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Họ và Tên
            </label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              name="fullName"
              value={newUser.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Số điện thoại
            </label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              name="phoneNumber"
              value={newUser.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              required
            />
          </div>
          {errorMessage && (
            <div className="text-danger mb-3">
              {errorMessage}
            </div>
          )}
          <button type="submit" className="btn login-btn">
            Đăng ký
          </button>
        </form>
        <div className="no-account mt-3">
          <span>Bạn đã có tài khoản?</span>
          <div onClick={() => navigate('/sign-in')} className="register-link ms-2">
            Đăng nhập ngay
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
