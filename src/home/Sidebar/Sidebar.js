import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import "./Sidebar.scss";
import logo from "../../assets/logo.png";
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/ri";
import { PiNotepadFill } from "react-icons/pi";
import { IoBagAddSharp } from "react-icons/io5";
import { BiSolidDiscount } from "react-icons/bi";

const menuItems = [
  {
    title: "TỔNG QUAN",
    icon: MdDashboard,
    key: "overview",
    children: [
      { title: "Thống kê", path: "/admin/statistical" },
      { title: "Nhập hàng", path: "/admin/admin-inventory" },
    ],
  },
  {
    title: "NGƯỜI DÙNG",
    icon: MdManageAccounts,
    key: "users",
    children: [
      { title: "Quản lý người dùng", path: "/admin/manage-user" },
      { title: "Nhà phân phối", path: "/admin/manage-supplier" },
    ],
  },
  {
    title: "ĐƠN HÀNG",
    icon: PiNotepadFill,
    key: "orders",
    children: [
      { title: "Quản lý đơn hàng", path: "/admin/all-orders" },
      { title: "Lịch sử xuất nhập", path: "/admin/inventory" },
    ],
  },
  {
    title: "SẢN PHẨM",
    icon: IoBagAddSharp,
    key: "products",
    children: [
      { title: "Quản lý sản phẩm", path: "/admin/manage-product" },
      { title: "Quản lý danh mục", path: "/admin/manage-category" },
      { title: "Quản lý Thương hiệu", path: "/admin/manage-brand" },
    ],
  },
  {
    title: "KHUYẾN MÃI",
    icon: BiSolidDiscount,
    key: "discount",
    children: [
      { title: "Mã giảm giá", path: "/admin/voucher" },
    ],
  },
  
  
];

const Sidebar = () => {
  const location = useLocation();
  
  // Set all sections to be open initially
  const [openSections, setOpenSections] = useState(
    menuItems.reduce((acc, item) => ({ ...acc, [item.key]: true }), {})
  );

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderMenuItem = (item) => (
    <div key={item.key}>
      <div className="title mt-1 mb-1" onClick={() => toggleSection(item.key)}>
        <item.icon className="icon" />
        {item.title}
        {openSections[item.key] ? <RiArrowDropUpLine className="arrow-icon" /> : <RiArrowDropDownLine className="arrow-icon" />}
      </div>
      {openSections[item.key] && (
        <div className="dropdown-content">
          {item.children.map(child => (
            <li key={child.path} className={location.pathname === child.path ? 'active' : ''}>
              <Link to={child.path}>{child.title}</Link>
            </li>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">
          <img src={logo} alt='Logo' />
        </span>
      </div>
      <div className="bottom">
        <ul>
          {menuItems.map(renderMenuItem)}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
