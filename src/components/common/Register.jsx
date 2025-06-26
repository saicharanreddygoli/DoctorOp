// src/components/common/Register.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message } from 'antd';
import p2 from '../../images/p2.png';
import { Button, Form, Row, Col, Card } from 'react-bootstrap'; // Import Card, Row, Col
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/axiosConfig'; // Use centralized api


const Register = () => {
  const navigate = useNavigate();

   // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem('userData');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.type === 'admin') {
          navigate('/adminhome');
        } else {
          navigate('/userhome');
        }
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
      }
    }
  }, [navigate]); // Add navigate to dependency array


  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    type: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!user.fullName || !user.email || !user.password || !user.phone || !user.type) {
        message.error('Please fill in all fields.');
        return;
    }

    try {
      // Use centralized api instance
      const res = await api.post('/user/register', user);
      if (res.data.success) {
        message.success('Registered Successfully. Please login.');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Something went wrong during registration.');
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <Link to={'/'}>MediCareBook</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll></Nav>
            <Nav>
              {/* Use Nav.Link with as={Link} */}
              <Nav.Link as={Link} to={'/'}>Home</Nav.Link>
              <Nav.Link as={Link} to={'/login'}>Login</Nav.Link>
              <Nav.Link as={Link} to={'/register'}>Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-5">
         {/* Using React Bootstrap Card, Row, Col */}
        <Card style={{ border: 'none' }}>
          <Row className='g-0 p-3' style={{ background: 'rgb(190, 203, 203)' }}>
            <Col md='6' order-md="2"> {/* Image on the right for register */}
               <Card.Img style={{ mixBlendMode: 'darken', objectFit: 'cover', height: '100%' }} src={p2} alt="register form" className='rounded-start w-100 h-100' /> {/* Adjusted styles */}
            </Col>
            <Col md='6' order-md="1"> {/* Form on the left */}
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
                      <Form.Control style={{ height: '40px' }} name='phone' value={user.phone} onChange={handleChange} type='tel' size="sm" required /> {/* Use type='tel' */}
                    </Form.Group>

                    <Container className='my-3'>
                       <Form.Label className='me-3'>Register as:</Form.Label> {/* Added label for radios */}
                       <Form.Check
                          inline
                          label='Admin'
                          name='type'
                          type='radio'
                          id='inlineRadioAdmin'
                          value='admin'
                          checked={user.type === 'admin'}
                          onChange={handleChange}
                          required // Make role selection required
                       />
                       <Form.Check
                          inline
                          label='User'
                          name='type'
                          type='radio'
                          id='inlineRadioUser'
                          value='user'
                          checked={user.type === 'user'}
                          onChange={handleChange}
                          required // Make role selection required
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