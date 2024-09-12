import React, { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Auth/Login';
import { path } from './utils/constant'; 
import MyComponent from './Auth/test';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer } from 'react-toastify';
import Header from './components/main/Header';
import Footer from './components/main/Footer';

function App() {
  return (
    <Fragment>
      <Header />
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path="/test" element={<MyComponent />} />
      </Routes>
      <Footer/>
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
    </Fragment>
  );
}

export default App;