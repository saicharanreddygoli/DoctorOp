// src/components/admin/AdminHome.jsx
import React, { useEffect, useState } from 'react';
// CORRECTED: Changed path from '/utils/axiosConfig' to '../../utils/axiosConfig'
import api from '/utils/axiosConfig';
import { Link } from 'react-router-dom'; // Keep Link for potential future navigation
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

  const getUserData = async () => {
    try {
      // Use centralized api instance - the response is not used here,
      // assuming it's a check or relies on side effects (e.g., context update)
      await api.post('/user/getuserdata', {});
    } catch (error) {
      console.error('Error fetching user data:', error); // Use console.error
      // Potentially handle error, e.g., redirect to login if token is invalid
    }
  };

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData(user);
    }
  };

  useEffect(() => {
    // Fetch user data from localStorage and potentially validate with API
    getUser();
    // getUserData(); // Keep if API validation on mount is required
  }, []); // Empty dependency array to run only on mount

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // Using navigate('/') is more React Router idiomatic than window.location.href
    // But keeping window.location for minimal structural change
    window.location.href = '/';
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  // Define menu items with associated key and component
  const menuItems = [
    { key: 'adminusers', text: 'Users', icon: <CalendarMonthIcon className='icon' />, component: <AdminUsers /> },
    { key: 'admindoctors', text: 'Doctors', icon: <MedicationIcon className='icon' />, component: <AdminDoctors /> },
    { key: 'adminappointments', text: 'Appointments', icon: <CalendarMonthIcon className='icon' />, component: <AdminAppointments /> }, // Added appointments
    { key: 'notification', text: 'Notifications', icon: <NotificationsIcon className='icon' />, component: <Notification /> }, // Notifications as a menu item
    { key: 'logout', text: 'Logout', icon: <LogoutIcon className='icon' />, onClick: logout }, // Logout action
  ];

  // Filter items that should be in the sidebar menu vs header
  const sidebarMenuItems = menuItems.filter(item => item.key !== 'notification' && item.key !== 'logout');
  const headerItems = menuItems.filter(item => item.key === 'notification');


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
                  <span>{item.text}</span>
                </div>
              ))}
               {/* Logout item placed directly as it has an action */}
               <div
                  className={`menu-items ${activeMenuItem === 'logout' ? 'active' : ''}`}
                  onClick={logout}
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
                   <Badge
                      key={item.key}
                      className={`notify ${activeMenuItem === item.key ? 'active' : ''}`}
                      onClick={() => handleMenuItemClick(item.key)}
                      count={userdata?.notification ? userdata.notification.length : 0}
                      style={{ cursor: 'pointer' }} // Add cursor style
                    >
                     {item.icon}
                    </Badge>
                ))}

                {/* User info */}
                <h3>Hi..{userdata.fullName}</h3>
              </div>
            </div>
            <div className="body">
              {/* Render the component based on activeMenuItem */}
              {menuItems.find(item => item.key === activeMenuItem)?.component || <AdminAppointments /> /* Default to appointments */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;