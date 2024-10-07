import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const AddOffice = () => {
  const [office, setOffice] = useState({
    name: '',
    location: ''
  });
  const navigate = useNavigate();

  // Retrieve the token from localStorage
  const getAuthToken = () => localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffice({
      ...office,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getAuthToken();
// Change this line in your React component to match the backend route
axios.post(`${apiUrl}/office/`, office, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  
    .then(() => {
      Swal.fire('Success', 'Office added successfully!', 'success');
      navigate('/office');
    })
    .catch(error => {
      Swal.fire('Error', 'There was an error adding the office', 'error');
      console.error('Error adding office', error);
    });
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <Container className="mt-5">
            <h2 className="text-center mb-4">Add Office</h2>
            <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
              
              <Form.Group controlId="formOfficeName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={office.name}
                  onChange={handleChange}
                  placeholder="Enter Office Name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formLocation" className="mt-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={office.location}
                  onChange={handleChange}
                  placeholder="Enter Office Location"
                  required
                />
              </Form.Group>

              <Row className="mt-4">
                <Col className="text-center">
                  <Button type="submit" variant="primary">
                    Add Office
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default AddOffice;
