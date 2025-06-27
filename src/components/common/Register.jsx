// src/components/common/Register.jsx
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message } from 'antd';
import p2 from '../../images/p2.png';
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '/utils/axiosConfig';


const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    type: 'user' // Initialize type to 'user'
  });

  const handleChange = (e) => {
    // Handle radio button changes specifically for 'type'
    if (e.target.name === 'type') {
        setUser({ ...user, type: e.target.value });
    } else {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!user.fullName || !user.email || !user.password || !user.phone || !user.type) {
        message.error('Please fill in all fields.');
        return;
    }

    try {
      // Send the user object including the selected type to the backend
      const res = await api.post('/user/register', user);

      if (res.data.success) {
        message.success(res.data.message);
        // Redirect to login after successful registration (admin or user)
        navigate('/login');
      } else {
        // Show backend error message (e.g., "User already exists" or "An administrator account already exists")
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      // More generic error if backend doesn't send a specific message or there's a network issue
      message.error('Something went wrong during registration.');

       // If backend sent a specific error message in the response body, try to show it
       if (error.response && error.response.data && error.response.data.message) {
           message.error(`Error: ${error.response.data.message}`);
       }
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            MediCareBook
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll></Nav>
            <Nav>
              <Nav.Link as={Link} to={'/'}>Home</Nav.Link>
              <Nav.Link as={Link} to={'/login'}>Login</Nav.Link>
              <Nav.Link as={Link} to={'/register'}>Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-5">
        <Card style={{ border: 'none' }}>
          <Row className='g-0 p-3' style={{ background: 'rgb(190, 203, 203)' }}>
            <Col md='6' order-md="2">
               <Card.Img style={{ mixBlendMode: 'darken', objectFit: 'cover', height: '100%' }} src={p2} alt="register form" className='rounded-start w-100 h-100' />
            </Col>
            <Col md='6' order-md="1">
              <Card.Body className='d-flex mx-3 flex-column'>
                <div className='d-flex flex-row mb-2'>
                  <span className="h1 text-center fw-bold">Sign up to your account</span>
                </div>
                <div className="p-2">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-2" controlId="formBasicFullName">
                      <Form.Label>Full name</Form.Label>
                      <Form.Control style={{ height: '40px' }} name='fullName' value={user.fullName} onChange={handleChange} type='text' size="sm" required />
                    </Form.Group>

                     <Form.Group className="mb-2" controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control style={{ height: '40px' }} name='email' value={user.email} onChange={handleChange} type='email' size="sm" required />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control style={{ height: '40px' }} name='password' value={user.password} onChange={handleChange} type='password' size="sm" required />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control style={{ height: '40px' }} name='phone' value={user.phone} onChange={handleChange} type='tel' size="sm" required />
                    </Form.Group>

                    <Container className='my-3'>
                       <Form.Label className='me-3'>Register as:</Form.Label>
                       {/* Admin Radio Button - Added back */}
                       <Form.Check
                          inline
                          label='Admin'
                          name='type'
                          type='radio'
                          id='inlineRadioAdmin'
                          value='admin' // Value is 'admin'
                          checked={user.type === 'admin'} // Check if state type is 'admin'
                          onChange={handleChange} // Handle change
                          required
                       />
                       {/* User Radio Button */}
                       <Form.Check
                          inline
                          label='User'
                          name='type'
                          type='radio'
                          id='inlineRadioUser'
                          value='user' // Value is 'user'
                          checked={user.type === 'user'} // Check if state type is 'user'
                          onChange={handleChange} // Handle change
                          required
                       />
                    </Container>

                    <Button style={{marginTop: '10px'}} className="mb-4 bg-dark" variant='dark' size='lg' type="submit">Register</Button>
                  </Form>
                  <p className="mb-5 pb-md-2" style={{ color: '#393f81' }}>
                    Have an account? <Link to={'/login'} style={{ color: '#393f81' }}>Login here</Link>
                  </p>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default Register;