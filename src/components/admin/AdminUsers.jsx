// src/components/admin/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import api from '/utils/axiosConfig'; // Use centralized api
import { message } from 'antd'; // Use antd message

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      // Use centralized api instance
      const res = await api.get('/admin/getallusers');
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Something went wrong while fetching users.');
    }
  };

  useEffect(() => {
    getUsers();
  }, []); // Empty dependency array to run only on mount

  return (
    <div>
      <h4 className='p-3 text-center'>All Users</h4>
      <Container>
        <Table className='my-3' striped bordered hover responsive> {/* Added responsive */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th> {/* Changed isAdmin to Role */}
              <th>isDoctor</th>
              {/* <th>Action</th> Add if actions are needed later */}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.type}</td> {/* Display user type (admin/user) */}
                    <td>{user.isdoctor ? 'Yes' : 'No'}</td> {/* Simplified boolean check */}
                    {/* <td> Add action buttons here if needed */}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}> {/* Adjusted colspan */}
                  <Alert variant="info">
                    <Alert.Heading>No Users to show</Alert.Heading>
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

export default AdminUsers;