import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TbLogout } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/reducer/userSlice';
import image from '../../assets/avatar.webp';
import './Navbar.scss'

const Navbar = () => {
    const { isLoggedIn,userInfo} = useSelector(state => state.root.user);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState(userInfo ? userInfo.FullName : '');
    // const [image, setImage] = useState(userInfo ? userInfo.image : '');

    useEffect(() => {
        if (userInfo && userInfo.FullName) {
            const nameParts = userInfo.FullName.split(' ');
            setFirstName(nameParts.pop()); 
        }
    }, [userInfo]);



    const dispatch = useDispatch();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');

    };
    return (
        <>
            <div className='navbar'>
                <div className='navbarContainer row'>
                    <div className='items-right col-9'></div>
                    <div className='items-left col-3'>
                        <div className='item-image'>
                            {<img src={image} />}
                            <span className='hello'>
                                Hi, {firstName}!
                            </span>
                        </div>
                        <div onClick={handleLogout}><TbLogout className='icon' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Navbar;
