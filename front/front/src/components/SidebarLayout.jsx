
import React from 'react';
import Sidebar from './Sidebar';

function SidebarLayout({ children }) {
  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default SidebarLayout;
