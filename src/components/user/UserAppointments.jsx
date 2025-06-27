import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container, Button } from 'react-bootstrap';
import api from '/utils/axiosConfig'; // Use centralized api
import { message } from 'antd';

const UserAppointments = () => {
  // Initialize user state from localStorage or null on component render
  const [user, setUser] = useState(() => {
      const userDataString = localStorage.getItem('userData');
      try {
          return userDataString ? JSON.parse(userDataString) : null;
      } catch (e) {
          console.error("Failed to parse user data from localStorage:", e);
          localStorage.removeItem('userData'); // Clear corrupt data
          localStorage.removeItem('token');
          return null;
      }
  });
  // Determine isDoctor status based on user state
  const [isDoctor, setIsDoctor] = useState(user?.isdoctor === true); // Use optional chaining and ensure boolean

  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);


  // Effect to update isDoctor state if user state changes (e.g., after applying for doctor)
   useEffect(() => {
       setIsDoctor(user?.isdoctor === true);
   }, [user]);


  const getUserAppointment = async (userId) => {
    // Only attempt fetch if userId is valid
    if (!userId) {
        console.log("getUserAppointment: userId is null or undefined, skipping fetch.");
        return;
    }
    console.log(`Fetching user appointments for userId: ${userId}`);
    try {
      // Use centralized api instance
      // Use GET request for user appointments as the backend route is GET
      const res = await api.get('/user/getuserappointments', {
        // userId is sent as a query parameter for GET requests
        params: { userId: userId },
      });
      if (res.data.success) {
        // message.success(res.data.message); // Optional: too many messages might be annoying
        setUserAppointments(res.data.data);
      } else {
         message.error(res.data.message); // Show error if API call fails
      }
    } catch (error) {
      console.error('Error fetching user appointments:', error); // Use console.error
      message.error('Something went wrong fetching user appointments');
    }
  };

  const getDoctorAppointment = async (userId) => {
     // Only attempt fetch if userId is valid
     if (!userId) {
        console.log("getDoctorAppointment: userId is null or undefined, skipping fetch.");
        return;
     }
     console.log(`Fetching doctor appointments for userId: ${userId}`);
    try {
      // Use centralized api instance
      // FIX: Change to POST request to match backend route definition
      const res = await api.post('/doctor/getdoctorappointments', {
         // userId is sent in the request body for POST requests
         // Note: Backend controller actually uses req.user._id from authMiddleware,
         // so sending userId in the body here is technically redundant but matches previous structure.
         userId: userId, // Send userId in the body
      });
      if (res.data.success) {
        // message.success(res.data.message); // Optional: too many messages
        setDoctorAppointments(res.data.data);
      } else {
        message.error(res.data.message); // Show error if API call fails
      }
    } catch (error) {
      console.error('Error fetching doctor appointments:', error); // Use console.error
      message.error('Something went wrong fetching doctor appointments');
    }
  };

  // Effect to fetch appointments when user data is loaded and isDoctor status is determined/updated
  useEffect(() => {
    if (user?._id) { // Only run if user object and its _id is available
      if (isDoctor) {
        getDoctorAppointment(user._id); // Pass user._id to the fetch function
      } else {
        getUserAppointment(user._id); // Pass user._id to the fetch function
      }
    } else {
        console.log("User data or ID not available, skipping appointment fetch effect.");
    }
  }, [user?._id, isDoctor]); // Depend on user._id and isDoctor state


  // Updated handleStatus function for Doctor's actions
  const handleStatus = async (appointmentUserId, appointmentId, status) => {
    try {
      // Use centralized api instance
      const res = await api.post('/doctor/handlestatus', {
        // Send necessary data in the body
        userid: appointmentUserId, // This seems to be the patient's userId for notification purposes
        appointmentId: appointmentId,
        status: status,
      });
      if (res.data.success) {
        message.success(res.data.message);
        // Re-fetch doctor appointments to update the table after status change
        // Ensure user data and id are available before re-fetching
        if (user?._id) {
            getDoctorAppointment(user._id);
        }
      } else {
         message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error); // Use console.error
      message.error('Something went wrong updating status');
    }
  };

  const handleDownload = async (url, appointId) => {
      // Ensure user data and id are available before download attempt
      if (!user?._id) {
          message.error("User not authenticated."); // Should be handled by authMiddleware, but defensive
          return;
      }

    try {
      // Use centralized api instance
      // Send appointId as a query parameter for the GET request
      const res = await api.get('/doctor/getdocumentdownload', {
        params: { appointId: appointId }, // Send appointId as query parameter
        responseType: 'blob' // Important: response type should be blob for files
      });

       // Check if the response is a blob (indicating a successful file)
       if (res.data && res.data instanceof Blob) {
           // Extract the file name from the url parameter if available, or use a default
           const fileName = url ? url.split("/").pop() : `document_${appointId}.pdf`; // Fallback filename

           const fileUrl = window.URL.createObjectURL(res.data);
           const downloadLink = document.createElement("a");
           downloadLink.href = fileUrl;
           downloadLink.setAttribute("download", fileName);
           document.body.appendChild(downloadLink); // Append to body to make it clickable
           downloadLink.click();
           document.body.removeChild(downloadLink); // Clean up the element
           window.URL.revokeObjectURL(fileUrl); // Release the object URL

       } else {
          // Handle cases where the API returns non-blob data (e.g., an error message JSON)
          // Attempt to read the response as text to see if it's an error message
          // This might fail if the response wasn't designed to be text/JSON on error
           let errorMsg = 'Failed to download document.';
           try {
               // Need to read blob as text - this is complex.
               // A simpler approach might be to check response headers or content type
               // For now, rely on backend message if available in data.
               if (res.data && res.data.message) {
                   errorMsg = res.data.message;
               } else {
                    console.error("Download error: Received non-blob data without a message:", res.data);
               }
           } catch (parseError) {
               console.error("Download error: Failed to parse non-blob response as JSON/text", parseError);
                // If it's not JSON/text or parsing fails, use default message
           }
          message.error(errorMsg);
       }
    } catch (error) {
      console.error('Error downloading document:', error); // Use console.error
      // Handle network errors or specific Axios errors
      let errorMessage = 'Something went wrong during document download.';
        if (error.response && error.response.data && error.response.data.message) {
            // Use backend error message if available
            errorMessage = error.response.data.message;
        } else if (error.message) {
            // Use Axios error message
            errorMessage = error.message;
        }
      message.error(errorMessage);
    }
  };

  // Use isDoctor state for conditional rendering
  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments</h2>
      <Container>

        {/* Conditional rendering based on isDoctor status */}
        {isDoctor ? (
          // Doctor's view
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Patient Name</th> {/* Renamed for clarity */}
                <th>Date of Appointment</th>
                <th>Patient Phone</th> {/* Renamed for clarity */}
                <th>Document</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctorAppointments.length > 0 ? (
                doctorAppointments.map((appointment) => {
                  return (
                    <tr key={appointment._id}>
                      {/* Use optional chaining for safety */}
                      <td>{appointment.userName || 'N/A'}</td> {/* Assuming populated userName from backend */}
                      <td>{appointment.date}</td>
                       {/* Use optional chaining for safety */}
                      <td>{appointment.userPhone || 'N/A'}</td> {/* Assuming populated userPhone from backend */}
                      <td>
                         {/* Check if document exists and has a path */}
                         {appointment.document?.path ? (
                            <Button variant='link' onClick={() => handleDownload(appointment.document.path, appointment._id)}>{appointment.document.filename || 'Download Document'}</Button>
                         ) : (
                            'No Document' // Show 'No Document' if missing
                         )}
                      </td>
                      <td>{appointment.status}</td>
                      <td>
                        {/* Doctor can Approve or Reject only if status is 'pending' */}
                        {appointment.status === 'pending' ? (
                           <>
                              {/* Ensure appointment.userId exists before passing */}
                                {appointment.userId && (
                                    <Button
                                       className='mx-1'
                                       variant="outline-success"
                                       size='sm'
                                       onClick={() => handleStatus(appointment.userId, appointment._id, 'approved')}
                                    >
                                       Approve
                                    </Button>
                                )}
                                 {appointment.userId && (
                                    <Button
                                       variant="outline-danger"
                                       size='sm'
                                       onClick={() => handleStatus(appointment.userId, appointment._id, 'rejected')}
                                    >
                                       Reject
                                    </Button>
                                )}
                           </>
                        ) : (
                           // If status is not 'pending', just display the status text
                           <span>{appointment.status}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <Alert variant="info" className="text-center"> {/* Center the alert */}
                      <Alert.Heading>No Appointments to show</Alert.Heading>
                    </Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        ) : (
          // User's view
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Date of Appointment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userAppointments.length > 0 ? (
                userAppointments.map((appointment) => {
                  return (
                    <tr key={appointment._id}>
                       {/* Assuming user side appointment object has docName from backend mapping */}
                      <td>{appointment.docName || 'N/A'}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>
                    <Alert variant="info" className="text-center"> {/* Center the alert */}
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