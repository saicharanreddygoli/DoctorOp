// src/components/common/Notification.jsx
import { Tabs, message } from 'antd';
import api from '/utils/axiosConfig'; // Use centralized api
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [user, setUser] = useState(); // State to hold user data including notifications
  const navigate = useNavigate();

  // Load user data from localStorage on mount
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem('userData'));
    if (userdata) {
      setUser(userdata);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Update localStorage whenever the user state changes (specifically notifications)
  useEffect(() => {
     if (user) {
         localStorage.setItem('userData', JSON.stringify(user));
     }
  }, [user]); // Dependency array includes user

  const handleAllMarkRead = async () => {
    if (!user) return; // Prevent action if user data isn't loaded

    try {
      // Use centralized api instance
      const res = await api.post('/user/getallnotification', { userId: user._id });

      if (res.data.success) {
        // Update local state and localStorage AFTER successful API response
        const updatedUser = {
          ...user,
          notification: [], // Clear unread notifications
          seennotification: [...user.seennotification, ...user.notification] // Move to seen
        };
        setUser(updatedUser); // This will trigger the second useEffect to update localStorage
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      message.error("Something went wrong while marking notifications.");
    }
  };

  const handledeleteAllMark = async () => {
     if (!user) return; // Prevent action if user data isn't loaded

    try {
      // Use centralized api instance
      const res = await api.post('/user/deleteallnotification', { userId: user._id });

      if (res.data.success) {
        // Update local state and localStorage AFTER successful API response
        const updatedUser = { ...user, seennotification: [] }; // Clear seen notifications
        setUser(updatedUser); // This will trigger the second useEffect to update localStorage
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting notifications:', error);
      message.error("Something went wrong while deleting notifications.");
    }
  };

  return (
    <div>
      <h2 className='p-3 text-center'>Notification</h2>
      <Tabs defaultActiveKey="0"> {/* Added defaultActiveKey */}
        <Tabs.TabPane tab={`Unread (${user?.notification?.length || 0})`} key={0}> {/* Show count */}
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
              // Fixed onClick to use navigate
              <div
                key={index} // Use index as fallback key if _id is not available/unique
                onClick={() => navigate(notificationMsg.onClickPath)}
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
        <Tabs.TabPane tab={`Read (${user?.seennotification?.length || 0})`} key={1}> {/* Show count */}
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
              <div
                key={index} // Use index as fallback key
                onClick={() => navigate(notificationMsg.onClickPath)}
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