import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const CustomerLayout = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex-1 relative ">
        <Outlet /> 
      </div>
    </div>
  );
};

export default CustomerLayout;
