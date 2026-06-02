import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-[#0a1f12] text-white">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 relative overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
