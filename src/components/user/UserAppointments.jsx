// src/components/user/UserAppointments.jsx
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container, Button } from 'react-bootstrap';
import api from '/utils/axiosConfig'; // Use centralized api
import { message } from 'antd';

const UserAppointments = () => {
  const [userid, setUserId] = useState(null); // Initialize with null
  const [type, setType] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);

  // Effect to load user data from localStorage ONCE on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserId(user._id);
      setType(user.isdoctor === true); // Ensure type is boolean
    } else {
      // Handle case where user data is not in localStorage (should be caught by auth route)
      console.warn('User data not found in localStorage.');
      // Redirect or show error if necessary
    }
  }, []); // Empty dependency array

  // Effect to fetch appointments when userid or type changes
  useEffect(() => {
    if (userid) { // Only fetch if userid is available
      if (type === true) {
        getDoctorAppointment();
      } else {
        getUserAppointment();
      }
    }
  }, [userid, type]); // Depend on userid and type


  const getUserAppointment = async () => {
    // console.log('Fetching user appointments for user ID:', userid); // Debug log
    try {
      // Use centralized api instance
      const res = await api.get('/user/getuserappointments', {
        params: {
          userId: userid, // Use userid state
        },
      });
      if (res.data.success) {
        // message.success(res.data.message); // Avoid excessive success messages on load
        setUserAppointments(res.data.data);
      } else {
        message.error(res.data.message || 'Failed to fetch user appointments.');
      }
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      message.error('Something went wrong while fetching user appointments.');
    }
  };

  const getDoctorAppointment = async () => {
    // console.log('Fetching doctor appointments for user ID:', userid); // Debug log
    try {
      // Use centralized api instance
      const res = await api.get('/doctor/getdoctorappointments', {
        params: {
          userId: userid, // Use userid state (which is the doctor's user ID)
        },
      });
      if (res.data.success) {
         // message.success(res.data.message); // Avoid excessive success messages on load
        setDoctorAppointments(res.data.data);
      } else {
        message.error(res.data.message || 'Failed to fetch doctor appointments.');
      }
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      message.error('Something went wrong while fetching doctor appointments.');
    }
  };

  const handleStatus = async (userIdOfUser, appointmentId, status) => { // Corrected parameter name for clarity
    try {
      // Use centralized api instance
      const res = await api.post('/doctor/handlestatus', {
        userid: userIdOfUser, // Send the ID of the user who booked
        appointmentId,
        status,
      });
      if (res.data.success) {
        message.success(res.data.message);
        // Refresh both lists just in case status change affects both views
        getDoctorAppointment();
        getUserAppointment();
      } else {
        message.error(res.data.message || 'Failed to update appointment status.');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      message.error('Something went wrong while updating status.');
    }
  };

  const handleDownload = async (url, appointId) => {
     if (!url) {
        message.info("No document available for this appointment.");
        return;
     }
     // Extract filename more safely
     const urlParts = url.split('/');
     let filename = urlParts.pop() || 'document'; // Get last part or default to 'document'
     // Remove query parameters if any
     filename = filename.split('?')[0];

    try {
      // Use centralized api instance - note responseType: 'blob' is important for binary data
      const res = await api.get('/doctor/getdocumentdownload', {
        params: { appointId }, // Assuming backend uses appointId param
        responseType: 'blob'
      });

      // Check if the response indicates an error from the backend (e.g., JSON error body)
      // This is tricky with responseType: 'blob'. You might need a backend change
      // to return non-blob errors with a specific status code (e.g., 400, 500)
      // For now, we'll just check the blob size - a very small blob might indicate an error message
      if (res.data.size < 100 && res.data.type === 'application/json') {
          // Attempt to read as text if it looks like a JSON error
          const text = await res.data.text();
          try {
              const errorJson = JSON.parse(text);
              message.error(errorJson.error || 'Failed to download document.');
              return;
          } catch (parseError) {
              console.error('Failed to parse error JSON:', parseError);
              message.error('Received unexpected response when trying to download.');
              return;
          }
      }


      // If it's a valid blob
      const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = fileUrl;
      downloadLink.download = filename; // Use the extracted filename
      downloadLink.style.display = "none";
      downloadLink.click();

      // Clean up the temporary URL and element
      window.URL.revokeObjectURL(fileUrl);
      document.body.removeChild(downloadLink);

      message.success('Document downloaded successfully.');

    } catch (error) {
      console.error('Error during document download:', error);
      message.error('Something went wrong while downloading the document.');
    }
  };

  // Basic date formatting helper
  const formatAppointmentDate = (dateString) => {
     if (!dateString) return 'N/A';
     try {
         return new Date(dateString).toLocaleString();
     } catch (e) {
         console.error("Failed to format date:", dateString, e);
         return dateString; // Return original if formatting fails
     }
  }


  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments</h2>
      <Container>
        {type === true ? ( // Doctor's view
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Date & Time</th> {/* Changed header */}
                <th>Phone</th>
                <th>Document</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctorAppointments.length > 0 ? (
                doctorAppointments.map((appointment) => {
                  // Assuming doctorAppointments has userInfo nested
                  return (
                    <tr key={appointment._id}>
                      <td>{appointment.userInfo?.fullName || 'N/A'}</td> {/* Optional chaining */}
                      <td>{formatAppointmentDate(appointment.date)}</td> {/* Format date */}
                      <td>{appointment.userInfo?.phone || 'N/A'}</td> {/* Optional chaining */}
                       {/* Check if document exists before rendering button */}
                      <td>
                         {appointment.document?.path ? (
                           <Button variant='link' onClick={() => handleDownload(appointment.document.path, appointment._id)}>
                              {appointment.document?.filename || 'Download Document'}
                           </Button>
                         ) : (
                            'No Document'
                         )}
                      </td>
                      <td>{appointment.status}</td>
                      <td>
                        {appointment.status === 'pending' ? (
                          <Button onClick={() => handleStatus(appointment.userInfo?._id, appointment._id, 'approved')}>
                            Approve
                          </Button>
                        ) : (
                           // Optionally add other actions or display status
                           appointment.status === 'approved' ? 'Approved' : 'Rejected'
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <Alert variant="info">
                      <Alert.Heading>No Appointments to show</Alert.Heading>
                    </Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        ) : ( // User's view
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Date & Time</th> {/* Changed header */}
                <th>Status</th>
                 {/* Add document column if users can see/download their uploaded docs later */}
              </tr>
            </thead>
            <tbody>
              {userAppointments.length > 0 ? (
                userAppointments.map((appointment) => {
                   // Assuming userAppointments has docName and date directly
                  return (
                    <tr key={appointment._id}>
                      <td>{appointment.docName || appointment.doctorInfo?.fullName || 'N/A'}</td> {/* Fallback for doctor name */}
                      <td>{formatAppointmentDate(appointment.date)}</td> {/* Format date */}
                      <td>{appointment.status}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}> {/* Adjusted colspan */}
                    <Alert variant="info">
                      <Alert.Heading>No Appointments to show</Alert.Heading>
                    </Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default UserAppointments;