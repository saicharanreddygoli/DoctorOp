import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import api from '/utils/axiosConfig'; // Use centralized api
import { message } from 'antd'; // Import message

const AdminUsers = () => {

   const [users, setUsers] = useState([])

   const getUsers = async()=>{
      try {
         // Use centralized api instance
         const res = await api.get('/admin/getallusers');
         if(res.data.success){
            setUsers(res.data.data);
            // console.log(res.data.data); // Log the fetched data, not the state
         } else {
             message.error(res.data.message); // Show backend message on failure
         }
      } catch (error) {
         console.error('Error fetching users:', error); // Use console.error
         message.error('Something went wrong fetching users'); // Show Antd message
      }
   }

   // Fetch users on component mount
   useEffect(()=>{
      getUsers();
   },[]) // Empty dependency array: runs only once on mount


   return (
      <div>
         <h4 className='p-3 text-center'>All Users</h4>

         <Container>
            <Table className='my-3' striped bordered hover>
               <thead>
                  <tr>
                     <th>Name</th>
                     <th>Email</th>
                     <th>Phone</th>
                     <th>Type</th> {/* Renamed from isAdmin for clarity based on user.type */}
                     <th>isDoctor</th>
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
                              <td>{user.type}</td>
                              {/* Check if user.isdoctor is explicitly true */}
                              <td>{user.isdoctor === true ? 'Yes' : 'No'}</td>
                           </tr>
                        )
                     })
                  ) : (
                     <tr>
                         <td colSpan={5}> {/* Adjusted colspan */}
                            <Alert variant="info" className="text-center"> {/* Center the alert */}
                               <Alert.Heading>No Users to show</Alert.Heading>
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

export default AdminUsers