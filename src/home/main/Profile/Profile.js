import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MenuUser from './MenuUser';
import Account from './Account/Account';
import Order from './Order/Order';
import Address from './Address/Address';

const Profile = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="left col-3">
                    <MenuUser />
                </div>
                <div className="right col-9">
                    <Routes>
                        <Route path="account" element={<Account />} />
                        <Route path="order" element={<Order />} />
                        <Route path="address" element={<Address />} />
                    </Routes>

                </div>
            </div>
        </div>
    );
};

export default Profile;