// src/components/common/Notification.jsx
import { Tabs, message } from 'antd';
import api from '/utils/axiosConfig'; // Use centralized api
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  // Initialize user state from localStorage or null
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  });

  const navigate = useNavigate();

  // Effect to sync localStorage to state on mount (and potentially future updates,
  // though a reactive context is better for sync across components)
  useEffect(() => {
    const handleStorageChange = () => {
       const userData = localStorage.getItem('userData');
       setUser(userData ? JSON.parse(userData) : null);
    };

    // Basic check on mount
    handleStorageChange();

    // Optional: listen for storage events (less common now, more for different tabs/windows)
    // window.addEventListener('storage', handleStorageChange);

    // Cleanup listener (if added)
    // return () => {
    //   window.removeEventListener('storage', handleStorageChange);
    // };
  }, []); // Empty dependency array ensures this runs only once on mount/unmount

  // Effect to update localStorage when user state changes (e.g., notifications read/deleted)
   useEffect(() => {
      if (user !== null) { // Only update if user is not null
         localStorage.setItem('userData', JSON.stringify(user));
      } else {
        // If user becomes null, clear local storage (e.g., on logout, handled elsewhere)
        // localStorage.removeItem('userData');
      }
   }, [user]); // Dependency array includes user

  const handleAllMarkRead = async () => {
    if (!user || !user._id) {
        message.error("User data not available.");
        return;
    }

    try {
      // Use centralized api instance
      const res = await api.post('/user/getallnotification', { userId: user._id });

      if (res.data.success) {
        // Update local state and localStorage AFTER successful API response
        const updatedUser = {
          ...user,
          seennotification: [...user.seennotification, ...user.notification], // Move all from unread to seen
          notification: [], // Clear unread notifications
        };
        setUser(updatedUser); // This will trigger the second useEffect to update localStorage
        message.success(res.data.message);
      } else {
        message.error(res.data.message); // Show backend message
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error); // Use console.error
      message.error("Something went wrong while marking notifications.");
    }
  };

  const handledeleteAllMark = async () => {
     if (!user || !user._id) {
        message.error("User data not available.");
        return;
    }

    try {
      // Use centralized api instance
      const res = await api.post('/user/deleteallnotification', { userId: user._id });

      if (res.data.success) {
        // Update local state and localStorage AFTER successful API response
        const updatedUser = { ...user, seennotification: [] }; // Clear seen notifications
        setUser(updatedUser); // This will trigger the second useEffect to update localStorage
        message.success(res.data.message);
      } else {
        message.error(res.data.message); // Show backend message
      }
    } catch (error) {
      console.error('Error deleting notifications:', error); // Use console.error
      message.error("Something went wrong while deleting notifications.");
    }
  };

  return (
    <div>
      <h2 className='p-3 text-center'>Notification</h2>
      {/* Added key to Tabs */}
      <Tabs defaultActiveKey="0" key="notificationTabs"> {/* Added defaultActiveKey and key */}
        <Tabs.TabPane tab={`Unread (${user?.notification?.length || 0})`} key="0"> {/* Show count, changed key to string "0" */}
          <div className="d-flex justify-content-end">
            <h4
              style={{ cursor: 'pointer', color: '#007bff' }} // Added color for link-like appearance
              onClick={handleAllMarkRead}
              className="p-2"
            >
              Mark all read
            </h4>
          </div>
          {/* Use optional chaining and map over the notification array */}
          {user?.notification && user.notification.length > 0 ? (
            user.notification.map((notificationMsg, index) => (
              // Fixed onClick to use navigate, used notificationMsg._id if available, else index
              <div
                key={notificationMsg._id || index} // Use _id if available, fallback to index
                onClick={() => notificationMsg.onClickPath && navigate(notificationMsg.onClickPath)} // Navigate only if onClickPath exists
                className="card mb-2" // Added margin bottom
                style={{ cursor: 'pointer' }} // Add cursor style
              >
                <div className="card-text p-2"> {/* Added padding */}
                  {notificationMsg.message}
                </div>
              </div>
            ))
          ) : (
             <div className="p-3 text-center text-muted">No unread notifications.</div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab={`Read (${user?.seennotification?.length || 0})`} key="1"> {/* Show count, changed key to string "1" */}
          <div className="d-flex justify-content-end">
            <h4
              style={{ cursor: 'pointer', color: '#dc3545' }} // Added color for delete action
              onClick={handledeleteAllMark}
              className="p-2"
            >
              Delete all read
            </h4>
          </div>
          {/* Use optional chaining and map over the seennotification array */}
          {user?.seennotification && user.seennotification.length > 0 ? (
            user.seennotification.map((notificationMsg, index) => (
              // Used notificationMsg._id if available, else index
              <div
                key={notificationMsg._id || index} // Use _id if available, fallback to index
                 onClick={() => notificationMsg.onClickPath && navigate(notificationMsg.onClickPath)} // Navigate only if onClickPath exists
                className="card mb-2" // Added margin bottom
                style={{ cursor: 'pointer' }} // Add cursor style
              >
                <div className="card-text p-2 text-muted"> {/* Added padding and muted text */}
                  {notificationMsg.message}
                </div>
              </div>
            ))
           ) : (
             <div className="p-3 text-center text-muted">No read notifications.</div>
           )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Notification;