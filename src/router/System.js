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
import CreateProduct from "../admin/Product/CreateProduct";
import UpdateProduct from "../admin/Product/UpdateProduct";
import VoucherGlobal from "../admin/Voucher/VoucherGlobal";
import VoucherSpecific from "../admin/Voucher/VoucherSpecific";
import Order from '../admin/Order/Order';
import Voucher from "../admin/Voucher/Voucher";
import Supplier from "../admin/ManagerSku/Supplier";
import ImportProduct from "../admin/ManagerSku/ImportProduct";
import Inventory from "../admin/ManagerSku/Inventory";
import ImportInventory from "../admin/ManagerSku/ImportInventory";
import Statistical from "../admin/Statistical/Statistical";
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
                        <Route path="create-product" element={<CreateProduct />} />
                  
                        <Route path="update-product/:id" element={<UpdateProduct />} />
                        <Route path="all-orders" element={<Order />} />
                        <Route path="voucher" element={<Voucher />} />
                        <Route path="voucher-global" element={<VoucherGlobal />} />
                        <Route path="voucher-specific" element={<VoucherSpecific />} />
                        <Route path="manage-supplier" element={<Supplier />} />
                        <Route path="admin-inventory" element={<ImportInventory />} />
                        <Route path="import-product" element={<ImportProduct />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="statistical" element={<Statistical />} />
                        
                        {/* Thêm các route khác cho admin ở đây */}
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default System;