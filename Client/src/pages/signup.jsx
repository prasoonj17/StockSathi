import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Constants for validation messages
const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  SHOP_NAME_REQUIRED: 'Shop name is required',
  ADDRESS_REQUIRED: 'Address is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  PASSWORDS_MISMATCH: 'Passwords do not match',
};

// Validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    shopName: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      shopName: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    if (!formData.name) {
      newErrors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
    }
    if (!formData.shopName) {
      newErrors.shopName = VALIDATION_MESSAGES.SHOP_NAME_REQUIRED;
    }
    if (!formData.address) {
      newErrors.address = VALIDATION_MESSAGES.ADDRESS_REQUIRED;
    }
    if (!formData.email) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }
    if (!formData.password) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_MISMATCH;
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const newErrors = validateForm();
    if (
      newErrors.name ||
      newErrors.shopName ||
      newErrors.address ||
      newErrors.email ||
      newErrors.password ||
      newErrors.confirmPassword
    ) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields correctly');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        shopName: formData.shopName,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      toast.success('Sign up successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 h-full w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-300 flex items-center justify-center p-4 overflow-hidden">
      <section
        className="bg-white bg-opacity-95 rounded-2xl p-6 w-full max-w-md shadow-xl border border-blue-200"
        role="main"
        aria-labelledby="signup-title"
      >
        {/* Logo */}
        <header className="flex justify-center mb-6">
          <h1
            id="signup-title"
            className="text-3xl font-bold text-blue-900 tracking-wider"
          >
            <span className="text-blue-500">Stock</span>Sathi
          </h1>
        </header>

        {/* Form */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="name"
              className="w-20 text-xs font-medium text-blue-900"
            >
              Name
            </label>
            <div className="flex-1">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 bg-blue-50 rounded-lg text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Full name"
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-red-600">
                  {errors.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="shopName"
              className="w-20 text-xs font-medium text-blue-900"
            >
              Shop Name
            </label>
            <div className="flex-1">
              <input
                id="shopName"
                name="shopName"
                type="text"
                value={formData.shopName}
                onChange={handleInputChange}
                className="w-full p-2 bg-blue-50 rounded-lg text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Shop name"
                required
                aria-invalid={!!errors.shopName}
                aria-describedby={errors.shopName ? 'shopName-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.shopName && (
                <p id="shopName-error" className="mt-1 text-xs text-red-600">
                  {errors.shopName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="address"
              className="w-20 text-xs font-medium text-blue-900"
            >
              Address
            </label>
            <div className="flex-1">
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 bg-blue-50 rounded-lg text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Address"
                required
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? 'address-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.address && (
                <p id="address-error" className="mt-1 text-xs text-red-600">
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="email"
              className="w-20 text-xs font-medium text-blue-900"
            >
              Email
            </label>
            <div className="flex-1">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 bg-blue-50 rounded-lg text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Email address"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="password"
                className="w-20 text-xs font-medium text-blue-900"
              >
                Password
              </label>
              <div className="flex-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-blue-50 rounded-lg text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Password"
                  required
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-blue-900 hover:text-blue-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884l-12-12 .708-.708 12 12-.708.708z" />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-xs text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="confirmPassword"
                className="w-20 text-xs font-medium text-blue-900"
              >
                Confirm
              </label>
              <div className="flex-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-blue-50 rounded-lg text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Confirm password"
                  required
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-blue-900 hover:text-blue-500"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884l-12-12 .708-.708 12 12-.708.708z" />
                    </svg>
                  )}
                </button>
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-blue-900 text-sm">
          <p className="mb-3">
            Already have an account?{' '}
            <NavLink
              to="/"
              className="text-blue-500 hover:underline"
              aria-label="Log in to your account"
            >
              Log in
            </NavLink>
          </p>
          Developed by Codes Book
          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="https://github.com/prasoonj17"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="text-blue-900 hover:text-blue-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/prasoonjain/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="text-blue-900 hover:text-blue-500"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="text-blue-900 hover:text-blue-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8s.01 2.445.048 3.299c.04.851.175 1.433.419 1.941a3.9 3.9 0 0 0 .923 1.417 3.9 3.9 0 0 0 1.417.923c.508.244 1.09.379 1.941.419C5.555 15.99 5.827 16 8 16s2.445-.01 3.299-.048c.851-.04 1.433-.175 1.941-.419a3.9 3.9 0 0 0 1.417-.923 3.9 3.9 0 0 0 .923-1.417c.244-.508.379-1.09.419-1.941C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.419-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.508-.244-1.09-.379-1.941-.419C10.445.01 10.173 0 8 0zm0 1.441a6.56 6.56 0 0 1 6.559 6.559A6.56 6.56 0 0 1 8 14.559 6.56 6.56 0 0 1 1.441 8 6.56 6.56 0 0 1 8 1.441zm0 3.668a2.891 2.891 0 0 0 0 5.782 2.891 2.891 0 0 0 0-5.782zm4.392-.883a.77.77 0 1 0 0-1.54.77.77 0 0 0 0 1.54z" />
              </svg>
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default SignUpPage;