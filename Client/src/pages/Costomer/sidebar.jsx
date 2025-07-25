import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ListBulletIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/solid';
import { HomeIcon } from '@heroicons/react/24/solid';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const [companyName, setCompanyName] = useState('Company Name');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch company name from localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData')) || {};
    setCompanyName(storedData.shopName || 'Company Name');
  }, []);

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && !event.target.closest('.sidebar-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  // Navigation routes with icons
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'All Product', path: '/dashboard/all-product', icon: ListBulletIcon },
    { name: 'Add Product', path: '/dashboard/add-product', icon: PlusCircleIcon },
    { name: 'Module Supplier', path: '/dashboard/module-supplier', icon: UsersIcon },
    { name: 'Purchases', path: '/dashboard/purchases', icon: ShoppingCartIcon },
    { name: 'Stock Report', path: '/dashboard/stock-report', icon: ChartBarIcon },
    { name: 'Saleout', path: '/dashboard/saleout', icon: CurrencyDollarIcon },
    { name: 'Logout', path: '/logout', icon: ArrowLeftOnRectangleIcon },
  ];

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-black-600 text-blue shadow-lg md:hidden"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed top-0 left-0 h-screen w-[260px] bg-gradient-to-b from-blue-500 to-blue-900 text-white flex flex-col shadow-2xl z-40 transition-all duration-300 ease-in-out ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        {/* Company Name Header */}
        <div className="p-6 text-center border-b border-blue-200/30">
          <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            {companyName}
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-200 transition-all duration-300 ease-in-out hover:scale-105 ${
                      isActive ? 'bg-blue-600/80 shadow-md' : ''
                    }`
                  }
                >
                  <item.icon className="w-6 h-6 mr-3 text-white" />
                  <span className="font-semibold text-white/90">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 text-center text-sm text-blue-100">
          <p>© 2025 codes.book</p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;