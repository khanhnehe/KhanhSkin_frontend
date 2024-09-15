import React, { useState } from 'react';
import './Login.scss';
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/reducer/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { unwrapResult } from '@reduxjs/toolkit'; // Import unwrapResult để lấy kết quả từ asyncThunk
import Paper from '@mui/material/Paper';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, isLoading } = useSelector((state) => state.user || { error: '', isLoading: false });

    const handleLogin = async () => {
        try {
          setFormSubmitted(true);
        // Kiểm tra input của form
        if (!email || !password) {
            return;
        }
            // Gọi dispatch để login
            const resultAction = await dispatch(loginUser({ email, password }));
            const result = unwrapResult(resultAction); // Lấy kết quả hoặc lỗi từ action

            // Kiểm tra xem login thành công hay không
            if (loginUser.fulfilled.match(resultAction)) {
                toast.success('Đăng nhập thành công!');
                navigate('/'); // Điều hướng về trang chủ
            }
        } catch (err) {
            // Hiển thị lỗi nếu có bất kỳ lỗi nào xảy ra
            toast.error(err.message);
        }
    };

    const handleOnChangeInputEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleOnChangeInputPassword = (event) => {
        setPassword(event.target.value);
    };

    const handleShowHidePass = () => {
        setIsShowPassword(!isShowPassword);
    };

    return (
        <>
            <div className="login-background">
                <div className='left-content mt-4 text-center'></div>
                <div className="login-container">
                    <div className="login-content row p-4 p3">
                        <div className="col-md-12 login-input form-group">
                            <div className="col-md-12 login-title text-center">Đăng nhập</div>
                            <label>Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email của bạn"
                                value={email}
                                onChange={handleOnChangeInputEmail}
                                required
                            />
                            {formSubmitted && !email && <div style={{ color: 'red', fontSize: "13px" }}>Email là bắt buộc.</div>}
                        </div>

                        <div className="col-md-12 login-input form-group mt-3">
                            <label>Mật khẩu:</label>
                            <div className="custom-input-pas">
                                <input
                                    type={isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Mật khẩu của bạn"
                                    value={password}
                                    onChange={handleOnChangeInputPassword}
                                    required
                                />
                                <span onClick={handleShowHidePass}>
                                    <i>
                                        {isShowPassword ? <FaRegEye className="eye-icon" /> : <FaEyeSlash className="eye-icon" />}
                                    </i>
                                </span>
                            </div>
                            {formSubmitted && !password && <div style={{ color: 'red', fontSize: "13px" }}>Mật khẩu là bắt buộc.</div>}
                        </div>

                        <div className="col-md-12" style={{ color: 'red' }}>
                            {/* Hiển thị thông báo lỗi (nếu có) */}
                            {error && <div>{error}</div>}
                        </div>
                        <div>
                            <button
                                type="button"
                                className="col-md-12 login-btn mt-4 text-light"
                                onClick={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            Bạn chưa có tài khoản?
                            <span onClick={() => navigate('/register')} className="register-link text-primary ms-2">
                                Đăng ký ngay
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;
