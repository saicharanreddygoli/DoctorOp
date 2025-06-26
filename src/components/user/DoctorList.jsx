// src/components/user/DoctorList.jsx
import { message } from 'antd';
import api from '../../utils/axiosConfig'; // Use centralized api
import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

// Renamed userDoctorId to currentUserId for clarity
const DoctorList = ({ currentUserId, doctor, userdata }) => {
  const [dateTime, setDateTime] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [show, setShow] = useState(false);

  // Get current date/time in the correct format for min attribute
  const currentDate = new Date().toISOString().slice(0, 16);

  const handleClose = () => {
    setShow(false);
    // Optionally reset form state here
    setDateTime('');
    setDocumentFile(null);
  };
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    setDateTime(event.target.value);
  };

  const handleDocumentChange = (event) => {
    // Get the first file from the selected files
    setDocumentFile(event.target.files[0]);
  };

  const handleBook = async (e) => {
    e.preventDefault();

    if (!dateTime) {
        message.error('Please select a date and time for the appointment.');
        return;
    }
     // Document is optional based on the input element
    // if (!documentFile) {
    //     message.error('Please upload a document.');
    //     return;
    // }


    try {
      const formData = new FormData();
      // Append doctor and user IDs
      formData.append('userId', currentUserId); // Use the prop here
      formData.append('doctorId', doctor._id); // Doctor's ID
      // Append date/time
      formData.append('date', dateTime); // Use the selected dateTime value directly
      // Append document file if selected
      if (documentFile) {
         formData.append('document', documentFile); // Use 'document' as field name
      }
      // Optional: Send user/doctor info if backend expects it, but often IDs are sufficient
      // formData.append('userInfo', JSON.stringify(userdata));
      // formData.append('doctorInfo', JSON.stringify(doctor));

      // Use centralized api instance
      const res = await api.post('/user/getappointment', formData, {
        headers: {
           // 'Content-Type': 'multipart/form-data' is automatically set by browser for FormData
           // Don't manually set Authorization here if using the interceptor
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        handleClose(); // Close modal on success
      } else {
        message.error(res.data.message || 'Failed to book appointment.'); // Display specific error or generic
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      message.error('Something went wrong while booking the appointment.');
    }
  };

  return (
    <>
      <Card style={{ width: '18rem', margin: '10px' }}> {/* Added margin */}
        <Card.Body>
          <Card.Title>Dr. {doctor.fullName}</Card.Title>
          <Card.Text>
            <p>Phone: <b>{doctor.phone}</b></p>
            <p>Address: <b>{doctor.address}</b></p>
            <p>Specialization: <b>{doctor.specialization}</b></p>
            <p>Experience: <b>{doctor.experience} Yrs</b></p>
            <p>Fees: <b>{doctor.fees}</b></p>
            {/* Ensure timings are displayed correctly */}
            <p>Timing: <b>{doctor.timings?.join(' - ') || 'N/A'}</b></p> {/* Handle potential null/undefined */}
          </Card.Text>
          <Button variant="primary" onClick={handleShow}>
            Book Now
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Booking appointment with Dr. {doctor.fullName}</Modal.Title> {/* Include doctor name */}
            </Modal.Header>
            <Form onSubmit={handleBook}>
              <Modal.Body>
                <strong><u>Doctor Details:</u></strong>
                <br />
                Name:  {doctor.fullName}
                <hr />
                Specialization: <b>{doctor.specialization}</b>
                <hr />
                <Row className='mb-3'>
                  <Col xs={12}> {/* Full width column in modal */}
                    <Form.Group controlId="formAppointmentDateTime" className="mb-3">
                      <Form.Label>Appointment Date and Time:</Form.Label>
                      <Form.Control
                        name='date'
                        type="datetime-local"
                        size="sm"
                        min={currentDate} // Disable past dates
                        value={dateTime}
                        onChange={handleChange}
                        required // Make date/time required
                      />
                    </Form.Group>

                    <Form.Group controlId="formDocumentUpload" className="mb-3">
                       <Form.Label>Upload Documents (Optional):</Form.Label> {/* Indicate optional */}
                       <Form.Control
                          accept="image/*,application/pdf" // Accept images and PDFs
                          type="file"
                          size="sm"
                          onChange={handleDocumentChange}
                       />
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel {/* Changed to Cancel for clarity */}
                </Button>
                <Button type='submit' variant="primary">
                  Book
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Card.Body>
      </Card>
    </>
  );
};

export default DoctorList;