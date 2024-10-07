import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const UpdateOffice = () => {
  const { id } = useParams(); // Get the office ID from the URL
  const [office, setOffice] = useState({
    name: '',
    location: ''
  });
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  // Retrieve the token from localStorage
  const getAuthToken = () => localStorage.getItem('token');

  // Fetch the existing office details
  useEffect(() => {
    const token = getAuthToken();
    axios
      .get(`${apiUrl}/office/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOffice(response.data); // Set the office details to state
      })
      .catch((error) => {
        console.error('Error fetching office data:', error);
        Swal.fire('Error', 'Could not fetch office details', 'error');
      });
  }, [id, apiUrl]);

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

    // Update office API call
    axios
      .put(`${apiUrl}/office/${id}/`, office, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        Swal.fire('Success', 'Office updated successfully!', 'success');
        navigate('/office'); // Navigate back to the office list
      })
      .catch((error) => {
        Swal.fire('Error', 'There was an error updating the office', 'error');
        console.error('Error updating office', error);
      });
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <Container className="mt-5">
            <h2 className="text-center mb-4">Update Office</h2>
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
                    Update Office
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

export default UpdateOffice;
