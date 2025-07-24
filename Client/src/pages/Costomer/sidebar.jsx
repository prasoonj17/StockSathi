import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ListBulletIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/solid';
import { HomeIcon } from '@heroicons/react/24/solid';
import { PlusCircleIcon } from '@heroicons/react/24/solid'; // ✅ v2 import

const Sidebar = () => {
  const [companyName, setCompanyName] = useState('Company Name');

  // Fetch company name from localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData')) || {};
    setCompanyName(storedData.shopName || 'Company Name');
  }, []);

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
    <div className="fixed top-0 left-0 h-screen w-[260px] bg-gradient-to-b from-blue-500 to-blue-900 text-white flex flex-col shadow-2xl z-50">
      {/* Company Name Header */}
      <div className="p-6 text-center border-b border-blue-200/30">
        <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
          {companyName}
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-200 transition-all duration-300 ease-in-out hover:scale-105 ${isActive ? 'bg-blue-600/80 shadow-md' : ''
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
  );
};

export default Sidebar;