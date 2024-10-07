import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AssetUpdateForm = () => {
  const { id: assetId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    issue_id: '',
    asset_status: 'A',
    pendingAndUpdated_desc: '',  // New field for update reason
  });

  const [divisions, setDivisions] = useState([]);
  const [loadingDivisions, setLoadingDivisions] = useState(true);
  const [errorDivisions, setErrorDivisions] = useState(null);

  const getAuthToken = () => localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!assetId) {
      console.error("Asset ID is undefined");
      return;
    }

    axios.get(`${apiUrl}/divisions/`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
    .then(response => {
      setDivisions(response.data);
      setLoadingDivisions(false);
    })
    .catch(error => {
      setErrorDivisions('Error fetching divisions');
      setLoadingDivisions(false);
    });

    axios.get(`${apiUrl}/assets/${assetId}/`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
    .then(response => {
      setFormData({
        name: response.data.name,
        issue_id: response.data.issue_id,
        asset_status: response.data.asset_status,
        pendingAndUpdated_desc: '',  // Keep blank for user input
      });
    })
    .catch(error => {
      console.error('Error fetching asset data', error);
    });
  }, [assetId, apiUrl]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getAuthToken();

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    axios.put(`${apiUrl}/assets/${assetId}/update/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      Swal.fire({
        title: 'Success!',
        text: 'Asset update request submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    })
    .catch(error => {
      Swal.fire({
        title: 'Error!',
        text: 'There was an error submitting the update request!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Update Asset</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter asset name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formIssueId">
              <Form.Label>Division (Issue)</Form.Label>
              <Form.Select
                name="issue_id"
                value={formData.issue_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a division</option>
                {loadingDivisions ? (
                  <option>Loading...</option>
                ) : (
                  divisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.name}
                    </option>
                  ))
                )}
              </Form.Select>
              {errorDivisions && <p className="text-danger">{errorDivisions}</p>}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formStatus">
              <Form.Label>Asset Status</Form.Label>
              <Form.Select
                name="asset_status"
                value={formData.asset_status}
                onChange={handleChange}
                required
              >
                <option value="A">Active</option>
                <option value="B">Need Troubleshoot</option>
                <option value="C">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formUpdateReason">
              <Form.Label>Reason for Update</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="pendingAndUpdated_desc"
                value={formData.pendingAndUpdated_desc}
                onChange={handleChange}
                placeholder="Provide a reason for the update"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="primary" type="submit">Submit Update Request</Button>
        </div>
      </Form>
    </Container>
  );
};

export default AssetUpdateForm;
