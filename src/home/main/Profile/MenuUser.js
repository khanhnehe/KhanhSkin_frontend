import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { PiNotepadFill } from "react-icons/pi";
// import logo from "../../assets/logo.png";
import "./MenuUser.scss";

const menuItems = [
  {
    title: "Tài khoản",
    icon: MdDashboard,
    path: "/profile/account",
  },
  {
    title: "Đơn hàng",
    icon: MdManageAccounts,
    path: "/profile/order" 
  },
  {
    title: "Địa chỉ",
    icon: PiNotepadFill,
    path: "/profile/address"
  },
];

const MenuUser = () => {
  const location = useLocation();

  return (
    <div className="menu">
      <div className="top">
        {/* <span className="logo">
          <img src={logo} alt='Logo' />
        </span> */}
      </div>
      <div className="bottom">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path}>
                <item.icon className="icon" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuUser;