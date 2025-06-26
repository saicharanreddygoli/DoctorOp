// src/components/admin/AdminDoctors.jsx
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import api from '/utils/axiosConfig'; // Use centralized api
import { message } from 'antd';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      // Use centralized api instance
      const res = await api.get('/admin/getalldoctors');
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Something went wrong while fetching doctors.');
    }
  };

  const handleApprove = async (doctorId, status, userId) => {
    console.log('Approving:', doctorId, status, userId); // Keep useful log
    try {
      // Use centralized api instance
      const res = await api.post('/admin/getapprove', { doctorId, status, userId });
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); // Refresh the list after action
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error approving doctor:', error);
      message.error('Something went wrong while approving.');
    }
  };

  const handleReject = async (doctorId, status, userId) => {
    console.log('Rejecting:', doctorId, status, userId); // Keep useful log
    try {
      // Use centralized api instance
      const res = await api.post('/admin/getreject', { doctorId, status, userId });
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); // Refresh the list after action
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      message.error('Something went wrong while rejecting.');
    }
  };

  useEffect(() => {
    getDoctors();
  }, []); // Empty dependency array to run only on mount

  return (
    <div>
      <h2 className='p-3 text-center'>All Doctors</h2>
      <Container>
        <Table striped bordered hover responsive> {/* Added responsive */}
          <thead>
            <tr>
              <th>Key</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th> {/* Added Status column for clarity */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.status}</td> {/* Display current status */}
                    <td>
                      {user.status === 'pending' ? (
                        <Button
                          onClick={() => handleApprove(user._id, 'approved', user.userId)}
                          className='mx-2'
                          size='sm'
                          variant="outline-success"
                        >
                          Approve
                        </Button>
                      ) : (
                        // Option to reject if approved, or disable/show rejected status
                        // Current logic allows rejecting if NOT pending (i.e., if approved or rejected)
                        <Button
                          onClick={() => handleReject(user._id, 'rejected', user.userId)}
                          className='mx-2'
                          size='sm'
                          variant="outline-danger"
                          disabled={user.status === 'rejected'} // Disable if already rejected
                        >
                           {user.status === 'rejected' ? 'Rejected' : 'Reject'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}> {/* Adjusted colspan */}
                  <Alert variant="info">
                    <Alert.Heading>No Doctors to show</Alert.Heading>
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

export default AdminDoctors;