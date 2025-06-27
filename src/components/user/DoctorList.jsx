import { message } from 'antd';
import api from '/utils/axiosConfig'; // Use centralized api
import React, { useState } from 'react'
import { Form, Row, Col, Button, Card, Modal } from 'react-bootstrap'; // Imported all components
import dayjs from 'dayjs'; // Import dayjs if needed for date handling, though using string now


// Destructure props for clarity
// Added fetchDoctors prop to refresh the list after booking if needed (optional)
const DoctorList = ({ doctor, userdata, fetchDoctors }) => {

   const [dateTime, setDateTime] = useState('');
   const [documentFile, setDocumentFile] = useState(null);
   const [show, setShow] = useState(false);

   // Get current date/time in the correct format for datetime-local min attribute
   const currentDate = dayjs().format('YYYY-MM-DDTHH:mm'); // Use dayjs for formatting


   const handleClose = () => {
      setShow(false);
      // Optionally reset form state when closing
      setDateTime('');
      setDocumentFile(null);
   };
   const handleShow = () => setShow(true);

   const handleChange = (event) => {
      setDateTime(event.target.value);
   };

   const handleDocumentChange = (event) => {
      setDocumentFile(event.target.files[0]);
   };

   const handleBook = async (e) => {
      e.preventDefault();

      if (!dateTime) {
          message.error('Please select date and time for the appointment.');
          return;
      }
       if (!documentFile) {
          message.error('Please upload a document.');
          return;
       }
      // Basic validation for future date/time
      if (dayjs(dateTime).isBefore(dayjs())) {
         message.error('Please select a future date and time.');
         return;
      }


      try {
         // The datetime-local value is already in 'YYYY-MM-DDTHH:mm' format.
         // Use this directly or format as required by your backend.
         // Using directly as backend schema uses String for date.
         // const formattedDateTime = dateTime; // Or dateTime.replace('T', ' '); if backend expects space

         const formData = new FormData();
         formData.append('document', documentFile); // Field name 'document' matching backend/schema
         formData.append('date', dateTime); // Use dateTime directly
         formData.append('userId', userdata._id); // Use userId from authenticated user data
         formData.append('doctorId', doctor._id); // Use doctorId from the doctor card

         // No longer sending full userInfo or doctorInfo objects in formData,
         // backend retrieves them based on userId/doctorId.

         // Use centralized api instance for the POST request
         const res = await api.post('/user/getappointment', formData, {
            headers: {
               // 'Content-Type': 'multipart/form-data', // FormData sets this automatically
            },
         });

         if (res.data.success) {
            message.success(res.data.message);
            handleClose(); // Close modal on success
            // Optional: Re-fetch the doctor list or user appointments if needed
            // if(fetchDoctors) fetchDoctors(); // Example of calling parent fetch function
         } else {
            // Show backend message on failure
            message.error(res.data.message);
         }
      } catch (error) {
         console.error('Error booking appointment:', error); // Use console.error
          let errorMessage = 'Something went wrong while booking appointment.';
           if (error.response && error.response.data && error.response.data.message) {
               errorMessage = error.response.data.message; // Use backend error message
           } else if (error.message) {
               errorMessage = error.message; // Use Axios error message
           }
         message.error(errorMessage);
      }
   }

   return (
      <>
         {/* Added key for list rendering in UserHome.jsx */}
         {/* Added some vertical margin using Bootstrap class */}
         <Card style={{ width: '18rem' }} className="my-2">
            <Card.Body>
               <Card.Title>Dr. {doctor.fullName}</Card.Title>
               {/* Optional: Use subtitle for specialization */}
               <Card.Subtitle className="mb-3 text-muted">{doctor.specialization}</Card.Subtitle> {/* Increased bottom margin */}

               {/* --- Improved Layout for Details --- */}
               {/* Using a custom grid class for better structure */}
               <div className="doctor-details-grid">
                   <div className="detail-item">
                       <small className="text-muted">Phone:</small>
                       <b>{doctor.phone}</b>
                   </div>
                   <div className="detail-item">
                       <small className="text-muted">Experience:</small>
                       <b>{doctor.experience} Yrs</b>
                   </div>
                    <div className="detail-item full-width"> {/* This item spans both columns */}
                       <small className="text-muted">Address:</small>
                       <b>{doctor.address}</b>
                   </div>
                    <div className="detail-item">
                       <small className="text-muted">Fees:</small>
                       <b>{doctor.fees}</b>
                   </div>
                   <div className="detail-item">
                       <small className="text-muted">Timing:</small>
                       {/* Display timings, using - as separator */}
                       <b>{doctor.timings?.[0] || 'N/A'} - {doctor.timings?.[1] || 'N/A'}</b>
                   </div>
               </div>
               {/* --- End Improved Layout --- */}

               <Button variant="primary" onClick={handleShow} className="mt-3"> {/* Added margin-top */}
                  Book Now
               </Button>

               {/* --- Modal remains the same --- */}
               <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                     <Modal.Title>Booking appointment</Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={handleBook}>
                     <Modal.Body>
                        <strong><u>Doctor Details:</u></strong>
                        <br />
                        Name:  {doctor.fullName}
                        <hr />
                        Specialization: <b>{doctor.specialization}</b>
                        <hr />
                        <Row className='mb-3'>
                           <Col xs={12}> {/* Adjusted column to take full width */}
                              <Form.Group controlId="formDateTime" className="mb-3">
                                 <Form.Label>Appointment Date and Time:</Form.Label>
                                 <Form.Control
                                    name='date'
                                    type="datetime-local"
                                    size="sm"
                                    min={currentDate} // Disable past dates
                                    value={dateTime}
                                    onChange={handleChange}
                                    required // Make required
                                 />
                              </Form.Group>

                              <Form.Group controlId="formFile" className="mb-3">
                                 <Form.Label>Documents (e.g., medical history) <span style={{color: 'red'}}>*</span></Form.Label>
                                 <Form.Control accept="image/*,.pdf" type="file" size="sm" onChange={handleDocumentChange} required />
                              </Form.Group>
                           </Col>
                        </Row>
                     </Modal.Body>
                     <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                           Close
                        </Button>
                        <Button type='submit' variant="primary">
                           Book
                        </Button>
                     </Modal.Footer>
                  </Form>
               </Modal>
               {/* --- End Modal --- */}
            </Card.Body>
         </Card>
      </>
   )
}

export default DoctorList