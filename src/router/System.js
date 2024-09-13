import React from "react";
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../home/Sidebar/Sidebar';
import Navbar from '../home/Navbar/Navbar';
import HomeAdmin from "../home/HomeAdmin";
import ManagerUser from "../admin/User/ManagerUser";
import './System.scss'; // Đảm bảo bạn có file CSS để định nghĩa các kiểu

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
                        {/* Thêm các route khác cho admin ở đây */}
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default System;