import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MenuUser from './MenuUser';
import Account from './Account/Account';
import OrderPage from './OrderPage/OrderPage';
import Address from './Address/Address';

const Profile = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="left col-3 mt-4">
                    <MenuUser />
                </div>
                <div className="right col-9">
                    <Routes>
                        <Route path="account" element={<Account />} />
                        <Route path="order" element={<OrderPage />} />
                        <Route path="address" element={<Address />} />
                    </Routes>

                </div>
            </div>
        </div>
    );
};

export default Profile;