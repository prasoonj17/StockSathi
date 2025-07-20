import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/forgot" element={<div>Forgot Password Page (To Be Implemented)</div>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;