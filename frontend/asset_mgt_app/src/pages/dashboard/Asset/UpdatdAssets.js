import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

const UpdatedAssets = () => {
  const [updatedAssets, setUpdatedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUpdatedAssets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/assets/updated/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUpdatedAssets(response.data);
      } catch (error) {
        setError('Error fetching updated assets.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdatedAssets();
  }, [token]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Updated Assets</h2>
      <Row>
        {updatedAssets.map((asset) => (
          <Col key={asset.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{asset.name}</Card.Title>
                <Card.Text>Asset Number: {asset.asset_number}</Card.Text>
                <Card.Text>Status: {asset.pendingAndUpdated_desc}</Card.Text>
                <Card.Text>Last Updated: {asset.updated_at}</Card.Text> {/* Assuming there's a timestamp for when it was updated */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UpdatedAssets;
