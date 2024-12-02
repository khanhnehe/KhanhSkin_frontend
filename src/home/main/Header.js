import React, { useState, useEffect } from 'react';
import './Header.scss';
import { Link, NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoSearch } from 'react-icons/io5';
import logo from "../../assets/logo.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TbLogout } from "react-icons/tb";
import { PiShoppingCart } from "react-icons/pi";
import { MdOutlineFavoriteBorder, MdOutlineAccountCircle } from "react-icons/md";
import { logout } from '../../store/reducer/userSlice'; // Import hành động logout từ Redux
import CategoryMenu from '../../components/CategoryMenu';
import Badge from '@mui/material/Badge';
import { getCartByUser } from '../../store/action/adminThunks';
import { MdOutlineShoppingBag } from "react-icons/md";
import { searchProducts } from '../../store/action/userThunks';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Sử dụng selector chính xác để lấy dữ liệu từ Redux store
    const { isLoggedIn, userInfo } = useSelector((state) => state.root.user);

    const [openMenu, setOpenMenu] = useState(false);
   // Tự động cập nhật họ tên và ảnh đại diện khi `userInfo` thay đổi
   const [firstName, setFirstName] = useState('');
   const [image, setImage] = useState('');
    
    const listCartOrder = useSelector((state) => state.root.admin.cartByUser);
    
    useEffect(() => {
        if (userInfo) {
            const nameParts = userInfo.fullName?.split(' ') || [];
            setFirstName(nameParts.pop()); // Lấy tên cuối
            setImage(userInfo.image || ''); // Gán ảnh đại diện nếu có
        }
    }, [userInfo]); // Lắng nghe sự thay đổi của `userInfo`

    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    };

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getCartByUser());
        }
    }, [dispatch, isLoggedIn]);


    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/sign-in');
    };

    const [searchproduct, setSearchProduct] = useState(''); // State lưu giá trị nhập

const handleSearchChange = (event) => {
    setSearchProduct(event.target.value); // Cập nhật giá trị tìm kiếm
};

const handleSearchSubmit = async (event) => {
    event.preventDefault(); // Ngăn việc tải lại trang
    if (searchproduct.trim() !== '') { // Kiểm tra nếu không rỗng
        await dispatch(searchProducts(searchproduct)); // Gửi từ khóa tìm kiếm đến Redux
        setSearchProduct(''); // Clear giá trị trong ô tìm kiếm
        navigate('/search-results'); // Điều hướng đến trang hiển thị kết quả
    }
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
        <span className='cart'>
            <Link to='/cart'>
                <Badge badgeContent={listCartOrder && listCartOrder.cartItems ? listCartOrder.cartItems.length : 0}
                    sx={{
                        '& .MuiBadge-badge': {
                            color: 'white !important',
                            backgroundColor: '#c31829',
                            fontSize: '14px',
                            height: '20px',
                            minWidth: '20px',
                            borderRadius: '10px',
                            top: '5px',
                            right: '0px'
                        }
                    }}
                >
                    <MdOutlineShoppingBag />
                </Badge>
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
                    <div className="header-left col-5">
                        <div className="search">
                            <form className="search-group" onSubmit={handleSearchSubmit}>
                                <input
                                    className="input-search"
                                    type="text"
                                    placeholder="Nhập tên sản phẩm cần tìm"
                                    value={searchproduct} // Gắn giá trị từ state
                                    onChange={(event) => handleSearchChange(event)} // Gọi hàm khi thay đổi giá trị
                                />
                                <button type="submit" className="icon-search">
                                    <IoSearch style={{ fontSize: "20px", paddingBottom: "2px" }} />
                                </button>
                            </form>
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
                                                <NavLink to='/sign-up' activeClassName='active me-3'>
                                                    Đăng ký
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            )}

                            <span className='links px-3' onClick={() => navigate('/favorite')}>
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