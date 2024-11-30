import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import "./MenuUser.scss";

const menuItems = [
  {
    title: "Tài khoản",
    icon: MdManageAccounts,
    path: "/profile/account",
  },
  {
    title: "Đơn hàng",
    icon: FiShoppingBag,
    path: "/profile/order",
  },
  {
    title: "Địa chỉ",
    icon: MdOutlineMapsHomeWork,
    path: "/profile/address",
  },
];

const MenuUser = () => {
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  // Đồng bộ selectedPath với location.pathname
  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="menu">
      <div className="top">
        {/* Thêm logo nếu cần */}
      </div>
      <div className="bottom">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
            <Link
              to={item.path}
              className={selectedPath === item.path ? "active" : ""}
              onClick={() => setSelectedPath(item.path)}
            >
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
