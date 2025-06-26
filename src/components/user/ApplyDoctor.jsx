// src/components/user/ApplyDoctor.jsx
import { Col, Form as AntForm, Input, Row, TimePicker, message } from 'antd'; // Use AntForm alias
import { Container } from 'react-bootstrap'; // Keep React Bootstrap Container
import React, { useState } from 'react';
import api from '../../utils/axiosConfig'; // Use centralized api

function ApplyDoctor({ userId }) { // Ensure userId prop is passed
  const [doctor, setDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    fees: '',
    timings: [], // Timings should be an array
  });

  const handleTimingChange = (dates, dateStrings) => {
     // dateStrings will be the formatted time strings, e.g., ['10:00', '18:00']
     setDoctor({ ...doctor, timings: dateStrings });
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (values) => { // Ant Design Form uses onFinish with form values
    console.log('Form values:', values); // Log Ant Design form values

    // You might need to map Ant Design form values back to your state structure
    // Or just use the 'values' object directly for the API call if structure matches
    // For now, assuming your state object 'doctor' is kept in sync by handleChange/handleTimingChange
    // And we'll send the 'doctor' state object + userId
    const doctorDataForApi = {
        ...doctor,
        userId: userId // Add userId to the data sent
    };

    try {
      // Use centralized api instance
      const res = await api.post('/user/registerdoc', doctorDataForApi); // Send doctorDataForApi

      if (res.data.success) {
        message.success(res.data.message);
        // Optionally reset form or redirect
      } else {
        // Backend might return success: false but still include a message
        message.error(res.data.message || 'Failed to apply for doctor.');
      }
    } catch (error) {
      console.error('Error applying for doctor:', error);
      message.error('Something went wrong while applying.');
    }
  };

  return (
    <Container>
      <h2 className='text-center p-3'>Apply for Doctor</h2>
      {/* Using Ant Design Form */}
      <AntForm layout="vertical" onFinish={handleSubmit} className='m-3'>
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <AntForm.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter your full name!' }]}>
              {/* Input onChange is used here to keep local state in sync for console.log or other uses */}
              {/* Ant Design Form will also manage the value internally via 'name' prop */}
              <Input placeholder='Enter name' onChange={handleChange} />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <AntForm.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
              <Input type='number' placeholder='Your phone' onChange={handleChange} />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <AntForm.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
              <Input type='email' placeholder='Your email' onChange={handleChange} />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <AntForm.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter your address!' }]}>
              <Input type='text' placeholder='Your address' onChange={handleChange} />
            </AntForm.Item>
          </Col>
        </Row>
        <h4>Professional Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <AntForm.Item label="Specialization" name="specialization" rules={[{ required: true, message: 'Please enter your specialization!' }]}>
              <Input type='text' placeholder='Your specialization' onChange={handleChange} />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <AntForm.Item label="Experience (Years)" name="experience" rules={[{ required: true, message: 'Please enter your experience!' }]}>
              <Input type='number' placeholder='Your experience' onChange={handleChange} />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <AntForm.Item label="Fees (Per Consultation)" name="fees" rules={[{ required: true, message: 'Please enter your fees!' }]}>
              <Input type='number' placeholder='Your fees' onChange={handleChange} />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <AntForm.Item label="Timings" name="timings" rules={[{ required: true, message: 'Please select your timings!' }]}>
              <TimePicker.RangePicker format="HH:mm" onChange={handleTimingChange} style={{ width: '100%' }} /> {/* Added style */}
            </AntForm.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          {/* Button type 'htmlType' is used with Ant Design Form */}
          <button className="btn btn-primary" htmltype="submit">Submit</button>
        </div>
      </AntForm>
    </Container>
  );
}

export default ApplyDoctor;