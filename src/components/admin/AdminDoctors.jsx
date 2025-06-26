import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import api from '/utils/axiosConfig'; // Use centralized api
import { message } from 'antd';

const AdminDoctors = () => {

   const [doctors, setDoctors] = useState([])

   const getDoctors = async () => {
      try {
         // Use centralized api instance
         const res = await api.get('/admin/getalldoctors');
         if (res.data.success) {
            setDoctors(res.data.data)
         } else {
             message.error(res.data.message); // Show backend message on failure
         }
      } catch (error) {
         console.error('Error fetching doctors:', error); // Use console.error
         message.error('Something went wrong fetching doctors');
      }
   }

   // Fetch doctors on component mount
   useEffect(() => {
      getDoctors();
   }, []) // Empty dependency array: runs only once on mount


   const handleApprove = async (doctorId, status, userid) => {
      try {
         // Use centralized api instance
         const res = await api.post('/admin/getapprove', { doctorId, status, userid });

         if (res.data.success) {
            message.success(res.data.message);
            getDoctors(); // Re-fetch doctors to update the table
         } else {
             message.error(res.data.message); // Show backend message on failure
         }
      } catch (error) {
         console.error('Error approving doctor:', error); // Use console.error
         message.error('something went wrong approving doctor');
      }
   }

   const handleReject = async (doctorId, status, userid) => {
      try {
         // Use centralized api instance
         const res = await api.post('/admin/getreject', { doctorId, status, userid });

         if (res.data.success) {
            message.success(res.data.message);
            getDoctors(); // Re-fetch doctors to update the table
         } else {
             message.error(res.data.message); // Show backend message on failure
         }
      } catch (error) {
         console.error('Error rejecting doctor:', error); // Use console.error
         message.error('something went wrong rejecting doctor');
      }
   }


   return (
      <div>
         <h2 className='p-3 text-center'>All Doctors</h2>

         <Container>
            <Table striped bordered hover>
               <thead>
                  <tr>
                     <th>Key</th>
                     <th>Name</th>
                     <th>Email</th>
                     <th>Phone</th>
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
                              <td>
                                 {/* Show Approve/Reject buttons only if status is pending */}
                                 {user.status === 'pending' ? (
                                    <>
                                       <Button onClick={() => handleApprove(user._id, 'approved', user.userId)} className='mx-2' size='sm' variant="outline-success">
                                          Approve
                                       </Button>
                                       <Button onClick={() => handleReject(user._id, 'rejected', user.userId)} className='mx-2' size='sm' variant="outline-danger">
                                          Reject
                                       </Button>
                                    </>
                                 ) : (
                                    // Otherwise, show the current status
                                    <span>{user.status}</span>
                                 )}
                              </td>
                           </tr>
                        )
                     })
                  ) : (
                     <tr>
                        <td colSpan={5}>
                           <Alert variant="info" className="text-center"> {/* Center the alert */}
                              <Alert.Heading>No Doctors to show</Alert.Heading>
                           </Alert>
                        </td>
                     </tr>

                  )}
               </tbody>
            </Table>
         </Container>
      </div>
   )
}

export default AdminDoctors