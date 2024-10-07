import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const AddDivision = () => {
  const [offices, setOffices] = useState([]);
  const [division, setDivision] = useState({
    name: '',
    head_of_division: '',
    office: '',
  });
  const navigate = useNavigate();

  // Retrieve the token from localStorage
  const getAuthToken = () => localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch offices
  useEffect(() => {
    const token = getAuthToken();
    axios.get(`${apiUrl}/office/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setOffices(response.data);
    })
    .catch(error => {
      console.error('Error fetching offices', error);
    });
  }, [apiUrl,]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDivision({
      ...division,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getAuthToken();

    axios.post(`${apiUrl}/divisions/`, division, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      Swal.fire('Success', 'Division added successfully!', 'success');
      navigate('/division');
    })
    .catch(error => {
      Swal.fire('Error', 'There was an error adding the division', 'error');
      console.error('Error adding division', error);
    });
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <Container className="mt-5">
            <h2 className="text-center mb-4">Add Division</h2>
            <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
              <Form.Group controlId="formDivisionName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={division.name}
                  onChange={handleChange}
                  placeholder="Enter division name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formHeadOfDivision" className="mt-3">
                <Form.Label>Head of Division</Form.Label>
                <Form.Control
                  type="text"
                  name="head_of_division"
                  value={division.head_of_division}
                  onChange={handleChange}
                  placeholder="Enter head of division"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formOffice" className="mt-3">
                <Form.Label>Office</Form.Label>
                <Form.Control
                  as="select"
                  name="office"
                  value={division.office}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Office</option>
                  {offices.map(office => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Row className="mt-4">
                <Col className="text-center">
                  <Button type="submit" variant="primary">
                    Add Division
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

export default AddDivision;
