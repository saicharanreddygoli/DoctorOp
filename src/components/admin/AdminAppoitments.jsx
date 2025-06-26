// src/components/admin/AdminAppoitments.jsx
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import api from '/utils/axiosConfig'; // Use centralized api
import { message } from 'antd'; // Use antd message for consistency

const AdminAppointments = () => {
  const [allAppointments, setAllAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      // Use centralized api instance
      const res = await api.get('/admin/getallAppointmentsAdmin');
      if (res.data.success) {
        setAllAppointments(res.data.data);
      } else {
        message.error(res.data.message); // Display error message from backend
      }
    } catch (error) {
      console.error('Error fetching admin appointments:', error); // Use console.error
      message.error('Failed to fetch appointments.'); // Generic error message
    }
  };

  useEffect(() => {
    getAppointments();
  }, []); // Empty dependency array to run only on mount

  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments for Admin Panel</h2>
      <Container>
        <Table className='my-3' striped bordered hover responsive> {/* Added responsive */}
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>User Name</th>
              <th>Doctor Name</th>
              <th>Date & Time</th> {/* Changed to reflect datetime-local */}
              <th>Status</th>
              {/* <th>Action</th> Add if actions are needed later */}
            </tr>
          </thead>
          <tbody>
            {allAppointments.length > 0 ? (
              allAppointments.map((appointment) => {
                // Basic date formatting - adjust based on actual data format
                const formattedDate = appointment.date ? new Date(appointment.date).toLocaleString() : 'N/A';

                return (
                  <tr key={appointment._id}>
                    <td>{appointment._id}</td>
                    <td>{appointment.userInfo?.fullName || 'N/A'}</td> {/* Added optional chaining */}
                    <td>{appointment.doctorInfo?.fullName || 'N/A'}</td> {/* Added optional chaining */}
                    <td>{formattedDate}</td>
                    <td>{appointment.status}</td>
                    {/* <td> Add action buttons here if needed */}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}> {/* Adjusted colspan */}
                  <Alert variant="info">
                    <Alert.Heading>No Appointments to show</Alert.Heading>
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AdminAppointments;