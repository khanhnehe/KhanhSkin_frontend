import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./Sidebar.scss";
import logo from "../../assets/logo.jpg";
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/ri"; // Import arrow icons
import { TbShoppingBagCheck } from "react-icons/tb";
import { BiSolidDiscount } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import { IoBagAddSharp } from "react-icons/io5";

const Sidebar = () => {
    // State to track dropdown toggles
    const [isOverviewOpen, setIsOverviewOpen] = useState(false);
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);

    // Toggle functions for dropdowns
    const toggleOverview = () => setIsOverviewOpen(!isOverviewOpen);
    const toggleUsers = () => setIsUsersOpen(!isUsersOpen);
    const toggleOrders = () => setIsOrdersOpen(!isOrdersOpen);
    const toggleProducts = () => setIsProductsOpen(!isProductsOpen);
    const toggleDiscount = () => setIsDiscountOpen(!isDiscountOpen);

    return (
        <div className="sidebar">
            <div className="top">
                <span className="logo">
                    <img src={logo} alt='Logo' />
                </span>
            </div>
            <div className="bottom">
                <ul>
                    {/* Tổng Quan Section */}
                    <div className="title mt-4" onClick={toggleOverview}>
                        <MdDashboard className="icon" />
                        TỔNG QUAN
                        {isOverviewOpen ? <RiArrowDropUpLine className="arrow-icon" /> : <RiArrowDropDownLine className="arrow-icon" />}
                    </div>
                    {isOverviewOpen && (
                        <div className="dropdown-content">
                            <li><Link to="/admin/admin-manage">Doanh thu</Link></li>
                            <li><Link to="/admin/phieu-nhap">Nhập hàng</Link></li>
                        </div>
                    )}

                    {/* Người Dùng Section */}
                    <div className="title" onClick={toggleUsers}>
                        <MdManageAccounts className="icon" />
                        NGƯỜI DÙNG
                        {isUsersOpen ? <RiArrowDropUpLine className="arrow-icon" /> : <RiArrowDropDownLine className="arrow-icon" />}
                    </div>
                    {isUsersOpen && (
                        <div className="dropdown-content">
                            <li><Link to="/admin/manage-user">Quản lý người dùng</Link></li>
                        </div>
                    )}

                    {/* Đơn Hàng Section */}
                    <div className="title" onClick={toggleOrders}>
                        <PiNotepadFill className="icon" />
                        ĐƠN HÀNG
                        {isOrdersOpen ? <RiArrowDropUpLine className="arrow-icon" /> : <RiArrowDropDownLine className="arrow-icon" />}
                    </div>
                    {isOrdersOpen && (
                        <div className="dropdown-content">
                            <li><Link to="/admin/all-orders">Quản lý đơn hàng</Link></li>
                        </div>
                    )}

                    {/* Sản Phẩm Section */}
                    <div className="title" onClick={toggleProducts}>
                        <IoBagAddSharp className="icon" />
                        SẢN PHẨM
                        {isProductsOpen ? <RiArrowDropUpLine className="arrow-icon" /> : <RiArrowDropDownLine className="arrow-icon" />}
                    </div>
                    {isProductsOpen && (
                        <div className="dropdown-content">
                            <li><Link to="/admin/manage-product">Quản lý sản phẩm</Link></li>
                            <li><Link to="/admin/manage-category">Quản lý danh mục</Link></li>
                            <li><Link to="/admin/manage-brand">Quản lý Thương hiệu</Link></li>
                            <li><Link to="/admin/manage-type">Quản lý phân loại</Link></li>
                        </div>
                    )}

                    {/* Khuyến Mãi Section */}
                    <div className="title" onClick={toggleDiscount}>
                        <BiSolidDiscount className="icon" />
                        KHUYẾN MÃI
                        {isDiscountOpen ? <RiArrowDropUpLine className="arrow-icon" /> : <RiArrowDropDownLine className="arrow-icon" />}
                    </div>
                    {isDiscountOpen && (
                        <div className="dropdown-content">
                            <li><Link to="/admin/manage-discount">Mã giảm giá</Link></li>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
