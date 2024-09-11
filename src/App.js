import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Auth/login';
import { path } from './utils/constant'; 
import MyComponent from './Auth/test';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path={path.LOGIN} element={<Login />} />
      <Route path="/test" element={<MyComponent />} />
    </Routes>
  );
}

export default App;
