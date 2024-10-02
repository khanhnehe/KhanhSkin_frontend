import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import "./Sidebar.scss";
import logo from "../../assets/logo.jpg";
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
      { title: "Doanh thu", path: "/admin/admin-manage" },
      { title: "Nhập hàng", path: "/admin/phieu-nhap" },
    ],
  },
  {
    title: "NGƯỜI DÙNG",
    icon: MdManageAccounts,
    key: "users",
    children: [
      { title: "Quản lý người dùng", path: "/admin/manage-user" },
    ],
  },
  {
    title: "ĐƠN HÀNG",
    icon: PiNotepadFill,
    key: "orders",
    children: [
      { title: "Quản lý đơn hàng", path: "/admin/all-orders" },
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
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const currentSection = menuItems.find(item => 
      item.children.some(child => location.pathname.includes(child.path))
    );
    if (currentSection) {
      setOpenSections(prev => ({ ...prev, [currentSection.key]: true }));
    }
  }, [location]);

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderMenuItem = (item) => (
    <div key={item.key}>
      <div className="title mt-2" onClick={() => toggleSection(item.key)}>
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