import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import api from '/utils/axiosConfig'; // Use centralized api
import { message } from 'antd'; // Import message for potential errors

const AdminAppointments = () => {

   const [allAppointments, setAllAppointments] = useState([])

   const getAppointments = async () => {
      try {
         // Use centralized api instance
         const res = await api.get('/admin/getallAppointmentsAdmin');
         if (res.data.success) {
            setAllAppointments(res.data.data)
         } else {
             // Show backend message on failure
             message.error(res.data.message);
         }

      } catch (error) {
         console.error('Error fetching admin appointments:', error); // Use console.error
         message.error('Something went wrong fetching admin appointments'); // Show Antd message
      }
   }

   // Fetch appointments on component mount
   useEffect(() => {
      getAppointments();
   }, []) // Empty dependency array: runs only once on mount

   return (
      <div>
         <h2 className='p-3 text-center'>All Appointments for Admin Panel</h2>
         <Container>
            <Table className='my-3' striped bordered hover>
               <thead>
                  <tr>
                     <th>Appointment ID</th>
                     <th>User Name</th>
                     <th>Doctor Name</th>
                     <th>Date</th>
                     <th>Status</th>

                  </tr>
               </thead>
               <tbody>
                  {allAppointments.length > 0 ? (
                     allAppointments.map((appointment) => {
                        return (
                           <tr key={appointment._id}>
                              <td>{appointment._id}</td>
                              {/* FIX: Access names from the new 'userName' and 'doctorName' fields */}
                              <td>{appointment.userName || 'N/A'}</td>
                              <td>{appointment.doctorName || 'N/A'}</td>
                              <td>{appointment.date}</td>
                              <td>{appointment.status}</td>
                           </tr>
                        )
                     })
                  ) : (
                     <tr>
                        <td colSpan={5}> {/* Adjusted colspan */}
                           <Alert variant="info" className="text-center"> {/* Center the alert */}
                              <Alert.Heading>No Appointments to show</Alert.Heading>
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
export default AdminAppointments