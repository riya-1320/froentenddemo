import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div>
      {/* Toggle button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
     <div>
     <div className="sidebar-heading">
          <h2>Dashboard</h2>
        </div>

        <nav className="nav">
          <ul>
            <li>
              <NavLink
                to="/dashboard/quotation"
                onClick={toggleSidebar}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/users"
                onClick={toggleSidebar}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Users
              </NavLink>
            </li>
          </ul>
        </nav>
     </div>

        <div className="logout">
          <NavLink to="/login" className="logout-btn" onClick={logout}>
            Logout
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
