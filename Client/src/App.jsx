import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import Dashboard from './pages/Costomer/dashboard';
import AddProduct from './pages/Costomer/addProduct';
import CustomerLayout from './pages/Costomer/CustomerLayout';
import GetAllProducts from './pages/Costomer/getAllProduct';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Protected Routes with Sidebar Layout */}
        <Route path="/dashboard" element={<CustomerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="all-product" element={<GetAllProducts />} />

        </Route>
      </Routes>

      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </BrowserRouter>
  );
}

export default App;