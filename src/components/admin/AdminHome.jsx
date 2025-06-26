// src/components/admin/AdminHome.jsx
import React, { useEffect, useState } from 'react';
// Corrected path to centralized api instance
import api from '/utils/axiosConfig';
// Removed Link as navigation is handled by state and onClick on the div
// import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge } from 'antd';
import Notification from '../common/Notification';
import AdminUsers from './AdminUsers';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments'; // Corrected import name

const AdminHome = () => {
  const [userdata, setUserData] = useState({});
  // Set a default active menu item, e.g., 'adminappointments'
  const [activeMenuItem, setActiveMenuItem] = useState('adminappointments'); // Set default

   // Function to fetch user data from localStorage
  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData(user);
    } else {
        // Redirect to login if user data is missing (shouldn't happen due to protected route)
        window.location.href = '/login'; // Or use navigate if you refactor App for Context
    }
  };

  // Function to potentially validate token/user data with API (optional for basic protected routes)
   const getUserDataFromApi = async () => {
      try {
         // Use centralized api instance - this API call might verify the token
         await api.post('/user/getuserdata', {});
         // If successful, the token is likely valid.
         // If it fails (e.g., 401), the axios interceptor (if implemented)
         // or the App.jsx routing logic based on localStorage will handle redirection.
      } catch (error) {
         console.error('Error fetching user data validation:', error); // Use console.error
         // Error here might indicate invalid token, App.jsx routing should catch this
         // But you could add extra handling if needed, e.g., a message.
      }
   };


  useEffect(() => {
    // Fetch user data from localStorage on mount
    getUser();
    // If you need to validate the token on every page load, uncomment this:
    // getUserDataFromApi();
  }, []); // Empty dependency array to run only on mount

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // Using window.location.href for simplicity matching previous code.
    // Using navigate('/') or window.location.reload() after clearing storage
    // would be better if App.jsx routing is updated to be reactive.
    window.location.href = '/login';
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  // Define menu items with associated key, text, icon, and component
  const menuItems = [
    { key: 'adminusers', text: 'Users', icon: <CalendarMonthIcon className='icon' />, component: <AdminUsers /> },
    { key: 'admindoctors', text: 'Doctors', icon: <MedicationIcon className='icon' />, component: <AdminDoctors /> },
    { key: 'adminappointments', text: 'Appointments', icon: <CalendarMonthIcon className='icon' />, component: <AdminAppointments /> }, // Added appointments
    // Notification and Logout are handled slightly differently in the UI
    { key: 'notification', text: 'Notifications', icon: <NotificationsIcon className='icon' />, component: <Notification /> },
    { key: 'logout', text: 'Logout', icon: <LogoutIcon className='icon' />}, // Logout action handled directly
  ];

  // Filter items for sidebar vs header
  const sidebarMenuItems = menuItems.filter(item => item.key !== 'notification' && item.key !== 'logout');
  const headerItems = menuItems.filter(item => item.key === 'notification');

  // Find the component to render based on activeMenuItem
  const renderComponent = () => {
      const activeItem = menuItems.find(item => item.key === activeMenuItem);
      // Default to AdminAppointments if activeMenuItem is not found or is logout/notification
      return activeItem?.component || <AdminAppointments />;
  };


  return (
    <>
      <div className='main'>
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h2>MediCareBook</h2>
            </div>
            <div className="menu">
              {sidebarMenuItems.map(item => (
                <div
                  key={item.key}
                  className={`menu-items ${activeMenuItem === item.key ? 'active' : ''}`}
                  onClick={() => handleMenuItemClick(item.key)}
                  style={{ cursor: 'pointer' }} // Add cursor style for clarity
                >
                  {item.icon}
                  {/* Removed the Link wrapper as click is handled by the div */}
                  {/* Added span for text */}
                  <span>{item.text}</span>
                </div>
              ))}
               {/* Logout item placed directly as it has an action */}
               {/* Added key for list rendering */}
               <div
                  key="logout" // Added key
                  className={`menu-items ${activeMenuItem === 'logout' ? 'active' : ''}`}
                  onClick={logout} // Direct onClick handler for logout
                  style={{ cursor: 'pointer' }}
                >
                  <LogoutIcon className='icon' />
                  <span>Logout</span>
                </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content">
                {/* Notifications item placed in header */}
                {headerItems.map(item => (
                   // Added key for list rendering
                   <Badge
                      key={item.key}
                      className={`notify ${activeMenuItem === item.key ? 'active' : ''}`}
                      onClick={() => handleMenuItemClick(item.key)}
                      // Use optional chaining when accessing nested properties
                      count={userdata?.notification?.length || 0}
                      style={{ cursor: 'pointer' }} // Add cursor style
                    >
                     {item.icon}
                    </Badge>
                ))}

                {/* User info */}
                 {/* Use optional chaining when accessing nested properties */}
                <h3>Hi..{userdata?.fullName || 'Admin'}</h3>
              </div>
            </div>
            <div className="body">
              {/* Render the component based on activeMenuItem */}
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;