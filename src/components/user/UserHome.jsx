// src/components/user/UserHome.jsx
import React, { useEffect, useState } from 'react';
import { Badge, Row, Col } from 'antd'; // Added Col for potential layout
import Notification from '../common/Notification';
import api from '/utils/axiosConfig'; // Use centralized api
import { Link } from 'react-router-dom'; // Keep Link for potential future use
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Container } from 'react-bootstrap'; // Keep Container
import ApplyDoctor from './ApplyDoctor';
import UserAppointments from './UserAppointments';
import DoctorList from './DoctorList';

const UserHome = () => {
  const [doctors, setDoctors] = useState([]);
  const [userdata, setUserData] = useState({});
  // Set a default active menu item, e.g., show doctors list or appointments
  const [activeMenuItem, setActiveMenuItem] = useState('home'); // Set a default key like 'home'

  // Effect to load user data from localStorage ONCE on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData(user);
       // If user is a doctor, maybe default to appointments view
       if (user.isdoctor) {
           setActiveMenuItem('userappointments');
       } else {
            // If user is not a doctor, default to home/doctor list view
           setActiveMenuItem('home');
       }
    } else {
      // Handle case where user data is not in localStorage
      console.warn('User data not found in localStorage.');
       // Potentially redirect to login
    }
  }, []); // Empty dependency array


  // getUserData is potentially redundant if user is loaded from localStorage and not updated
  // Keeping it commented out unless a specific API call is needed on load
  // const getUserData = async () => {
  //   try {
  //     await api.post('/user/getuserdata', {});
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //     // Potentially handle error (e.g., token expired)
  //   }
  // };

  const getDoctorData = async () => {
    try {
      // Use centralized api instance
      const res = await api.get('/user/getalldoctorsu'); // Assuming this endpoint lists doctors for users
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
         message.error(res.data.message || 'Failed to fetch doctors.');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Something went wrong while fetching doctors.');
    }
  };

  // Fetch doctors list when the component mounts (for the 'home' view)
  useEffect(() => {
     // Fetch doctors only if the user is not a doctor
     if (!userdata.isdoctor && activeMenuItem === 'home') {
        getDoctorData();
     }
  }, [activeMenuItem, userdata.isdoctor]); // Depend on activeMenuItem and user's doctor status

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    // Using navigate('/') is more React Router idiomatic
    // But keeping window.location for minimal structural change
    window.location.href = "/";
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

   // Define menu items with associated key and component
   // Note: Components requiring userdata need to receive it as props if not fetched inside
  const menuItems = [
    // 'home' is implicit default, renders doctor list
    { key: 'home', text: 'Home', icon: <CalendarMonthIcon className='icon' /> }, // Item for Home/Doctor list
    { key: 'userappointments', text: 'Appointments', icon: <CalendarMonthIcon className='icon' />, component: <UserAppointments /> },
    { key: 'applyDoctor', text: 'Apply Doctor', icon: <MedicationIcon className='icon' />, component: <ApplyDoctor userId={userdata._id} /> }, // Pass userId prop
    { key: 'notification', text: 'Notifications', icon: <NotificationsIcon className='icon' />, component: <Notification /> }, // Notifications as a menu item
    { key: 'logout', text: 'Logout', icon: <LogoutIcon className='icon' />, onClick: logout }, // Logout action
  ];

   // Filter items that should be in the sidebar menu vs header
  const sidebarMenuItems = menuItems.filter(item => item.key !== 'notification' && item.key !== 'logout' && item.key !== 'home'); // 'home' is handled implicitly or can be added

  // Add Home item explicitly if needed in sidebar
  const finalSidebarMenuItems = [
      { key: 'home', text: 'Home', icon: <CalendarMonthIcon className='icon' /> },
      ...sidebarMenuItems
  ];


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
              {finalSidebarMenuItems.map(item => (
                // Conditionally hide 'Apply Doctor' if user is already a doctor
                (item.key !== 'applyDoctor' || !userdata.isdoctor) ? (
                  <div
                    key={item.key}
                    className={`menu-items ${activeMenuItem === item.key ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick(item.key)}
                    style={{ cursor: 'pointer' }} // Add cursor style for clarity
                  >
                    {item.icon}
                    {/* Removed Link wrapper */}
                    <span>{item.text}</span>
                  </div>
                ) : null // Hide item if condition not met
              ))}

              {/* Logout item placed directly */}
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
                       style={{ cursor: 'pointer' }}
                    >
                     {item.icon}
                    </Badge>
                ))}

                {/* User info */}
                 {userdata.isdoctor && <h3>Dr. </h3>}
                 <h3>{userdata.fullName}</h3>
              </div>
            </div>
            <div className="body p-3"> {/* Added padding to body */}
              {/* Render component based on active menu item */}
              {activeMenuItem === 'notification' && <Notification />}
              {activeMenuItem === 'userappointments' && <UserAppointments />}
              {activeMenuItem === 'applyDoctor' && !userdata.isdoctor && <ApplyDoctor userId={userdata._id} />} {/* Render only if not doctor */}

              {/* Default view or 'home' view: Show doctor list if user is NOT a doctor */}
              {activeMenuItem === 'home' && !userdata.isdoctor && (
                 <Container>
                    <h2 className="text-center p-2">Available Doctors</h2> {/* Changed title */}
                    <Row gutter={[16, 16]} justify="center"> {/* Use Ant Design Row for grid, add gutter */}
                       {doctors && doctors.length > 0 ? (
                          doctors.map((doctor) => (
                             <Col key={doctor._id} xs={24} sm={12} md={8} lg={6}> {/* Use Ant Design Col for responsiveness */}
                                {/* Pass the current user's _id */}
                                <DoctorList currentUserId={userdata._id} doctor={doctor} userdata={userdata} />
                             </Col>
                          ))
                       ) : (
                           <Col span={24}> {/* Use Col for alert */}
                              <Alert variant="info" className="text-center">
                                 <Alert.Heading>No Doctors Available</Alert.Heading>
                              </Alert>
                           </Col>
                       )}
                    </Row>
                 </Container>
              )}

              {/* Default view if user is a doctor and no menu item is active */}
              {activeMenuItem === 'home' && userdata.isdoctor && (
                 <div className="text-center p-5"> {/* Simple message for doctor home */}
                    <h2>Welcome Dr. {userdata.fullName}</h2>
                    <p>Select 'Appointments' from the sidebar to view your appointments.</p>
                 </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserHome;