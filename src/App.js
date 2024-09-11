import React, { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Auth/login';
import { path } from './utils/constant'; 
import MyComponent from './Auth/test';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/main/Header';

function App() {
  return (
    <Fragment>
      <Header />
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path="/test" element={<MyComponent />} />
      </Routes>
    </Fragment>
  );
}

export default App;