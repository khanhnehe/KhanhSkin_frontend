import React, { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed BrowserRouter
import Login from './Auth/Login';
import { path } from './utils/constant';
import MyComponent from './Auth/test';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Header from './home/main/Header';
import Footer from './home/main/Footer';
import System from './router/System';
import HomeAdmin from './home/HomeAdmin'; // Import component cho admin
import UploadWidget from './utils/uploadWidget';
import CategoryMenu from './components/CategoryMenu';
import Home from './home/Home';
import CategoryPage from './home/main/CategoryPage/CategoryPage';
import TypePage from './home/main/TypePage/TypePage';
import BrandPage from './home/main/BrandPage/BrandPage';
import InfoProduct from './home/main/Infoproduct/InfoProduct';
import CartOrder from './home/main/Cart/CartOrder';
import Profile from './home/main/Profile/Profile';

function App() {
  return (
    <>
      <Routes>
        <Route path={path.ADMIN + "/*"} element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

const AdminRoutes = () => (
  <Routes>
    <Route path="/*" element={<System />} />
    {/* Thêm các route khác cho admin ở đây nếu cần */}
  </Routes>
);

const UserRoutes = () => (
  <Fragment>
    <Header />
    <CategoryMenu/>

    <Routes>
    <Route path={path.HOME} element={<Home />} />
    <Route path={path.LOGIN} element={<Login />} />
    <Route path={path.CATEGORY_PAGE} element={<CategoryPage />} />
    <Route path={path.TYPE_PAGE} element={<TypePage />} />
    <Route path={path.BRAND_PAGE} element={<BrandPage />} />
    <Route path={path.INFO_PRODUCT} element={<InfoProduct />} />
    <Route path={path.CART_ORDER} element={<CartOrder />} />
    <Route path="/profile/*" element={<Profile />} />
    <Route path="/test" element={<MyComponent />} />
    </Routes>

    <Footer />
  </Fragment>
);

export default App;
