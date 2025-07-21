import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-300 flex items-center justify-center">
      <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-blue-900">Welcome to StockSathi Dashboard</h1>
        <p className="mt-4 text-blue-900">This is your dashboard. Implement your features here.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot" element={<div>Forgot Password Page (To Be Implemented)</div>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </BrowserRouter>
  );
}

export default App;