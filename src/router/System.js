import React from "react";
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../home/Sidebar/Sidebar';
import Navbar from '../home/Navbar/Navbar';
import HomeAdmin from "../home/HomeAdmin";
import ManagerUser from "../admin/User/ManagerUser";
import Brand from "../admin/Product/Brand/Brand";
import Category from "../admin/Product/Category/Category";
import TypeProduct from "../admin/Product/Category/TypeProduct";
import Product from "../admin/Product/Product";
import './System.scss'; 

const System = () => {
    return (
        <div className='system'>
            <Sidebar />
            <div className='systemContainer'>
                <Navbar />
                <div className='content'>
                    <Routes>
                        <Route path="admin-manage" element={<HomeAdmin />} />
                        <Route path="manage-user" element={<ManagerUser />} />
                        <Route path="manage-brand" element={<Brand />} />
                        <Route path="manage-category" element={<Category />} />
                        <Route path="manage-product" element={<Product />} />
                        {/* <Route path="manage-category" element={<TypeProduct />} /> */}
                        {/* Thêm các route khác cho admin ở đây */}
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default System;