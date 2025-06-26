// src/components/common/Login.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message } from 'antd';
import { Button, Form, Row, Col, Card } from 'react-bootstrap'; // Import Card, Row, Col
import photo1 from '../../images/photo1.png';
import api from '/utils/axiosConfig'; // Use centralized api
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
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
        // If localStorage is corrupt, maybe clear it or ignore and let them log in
      }
    }
  }, [navigate]); // Add navigate to dependency array


  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use centralized api instance
      const res = await api.post("/user/login", user);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userData', JSON.stringify(res.data.userData));
        message.success('Login successfully');
        const loggedInUser = res.data.userData; // Use data from response directly

        switch (loggedInUser.type) {
          case "admin":
            navigate("/adminhome");
            break;
          case "user":
            navigate("/userhome");
            break;
          default:
            // Handle unexpected user type, maybe redirect to login or home
             navigate("/login");
            break;
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials.'); // More specific error
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
            <Col md='6'>
              <Card.Img src={photo1} alt="login form" className='rounded-start w-100' />
            </Col>
            <Col md='6'>
              <Card.Body className='d-flex mx-3 flex-column'>
                 {/* Adjusted margin for better spacing */}
                <div className='d-flex flex-row mt-2 mb-4'>
                  <span className="h1 fw-bold mb-0">Sign in to your account</span>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      size="md"
                      autoComplete='off'
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      placeholder="Password"
                      size="md"
                      autoComplete='off'
                      required
                    />
                  </Form.Group>

                  <Button variant="dark" type="submit" className="mb-4 px-5" size='lg'>
                    Login
                  </Button>
                </Form>

                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                  Don't have an account? <Link to={'/register'} style={{ color: '#393f81' }}>Register here</Link>
                </p>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default Login;