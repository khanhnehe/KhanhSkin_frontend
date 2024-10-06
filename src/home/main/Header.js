import React, { useState, useEffect } from 'react';
import './Header.scss';
import { Link, NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoSearch } from 'react-icons/io5';
import logo from "../../assets/logo.jpg";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TbLogout } from "react-icons/tb";
import { PiShoppingCart } from "react-icons/pi";
import { MdOutlineFavoriteBorder, MdOutlineAccountCircle } from "react-icons/md";
import { logout } from '../../store/reducer/userSlice'; // Import hành động logout từ Redux
import CategoryMenu from '../../components/CategoryMenu';
const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Sử dụng selector chính xác để lấy dữ liệu từ Redux store
    const { isLoggedIn, userInfo } = useSelector((state) => state.root.user);

    const [openMenu, setOpenMenu] = useState(false);
    const [firstName, setFirstName] = useState(userInfo ? userInfo.FullName : '');
    const [image, setImage] = useState(userInfo ? userInfo.Image : '');

    useEffect(() => {
        if (userInfo && userInfo.FullName) {
            const nameParts = userInfo.FullName.split(' ');
            setFirstName(nameParts.pop());
        }
        if (userInfo && userInfo.Image) {
            setImage(userInfo.Image);
        }

    }, [userInfo]);

    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/sign-in');
    };

    const logoHome = (
        <div className='logo'>
            <Link to='/'>
                <div>
                    <img src={logo} alt='Logo' />
                </div>
            </Link>
        </div>
    );

    const cartOrder = (
        <span className='cart '>
            <Link to='/cart'>
                <PiShoppingCart />
                {/* <p>{listCartOrder && listCartOrder.cartItems ? listCartOrder.cartItems.length : 0}</p> */}
            </Link>
        </span>
    );

    return (
        <>
            <div className='top-line'></div>
            <header>
                <div className='header'>
                    <div className='col-3'>
                        {logoHome}
                    </div>
                    <div className='header-left col-5'>
                        <div className='search'>
                            <div className='search-group'>
                                <input className='input-search' type='text' placeholder='Nhập tên sản phẩm cần tìm' />
                                <button className='icon-search'>
                                    <IoSearch />
                                </button>
                            </div>
                        </div>
                    </div>

                    <nav className={openMenu ? 'show-nav' : 'hide-nav'}>
                        <div className='header-right'>
                            {isLoggedIn ? (
                                <div className='links px-3'>
                                    <div className='account'>
                                        <div className="image-header">
                                            <img src={image} width="50" height="50" style={{ borderRadius: '50%' }} />
                                            <span className='hello'>
                                                Hi, {firstName}!
                                            </span>
                                        </div>

                                        <div className='login-dropdown'>
                                            <div className='login-links'>
                                                <NavLink to='/profile/account' activeClassName='active me-3'>
                                                    Hồ sơ
                                                </NavLink>

                                                <span className='links px-3' onClick={handleLogout}>
                                                    <div><TbLogout /></div>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <span className='links px-3'>
                                    <div className='account'>
                                        <MdOutlineAccountCircle className='icon-account' />
                                        <div className='login-dropdown'>
                                            <div className='login-links'>
                                                <NavLink to='/sign-in' activeClassName='active me-3'>
                                                    Đăng nhập
                                                </NavLink>
                                                <NavLink to='/register' activeClassName='active me-3'>
                                                    Đăng ký
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            )}

                            <span className='links px-3'>
                                <MdOutlineFavoriteBorder className='tim' />
                            </span>
                            {cartOrder}

                        </div>
                    </nav>

                    <div className='menu-icon'>
                        <GiHamburgerMenu onClick={toggleMenu} />
                    </div>
                </div>
            </header>

        </>
    );
};

export default Header;