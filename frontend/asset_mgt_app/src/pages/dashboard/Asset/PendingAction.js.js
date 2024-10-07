import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AssetStats = () => {
  const [stats, setStats] = useState({
    total_assets: 0,
    updated_assets: 0,
    pending_approval_assets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate(); // For navigation to other pages

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/assets/asset-stats/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        setError('Error fetching asset statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, apiUrl]);

  // Handler for navigating to filtered assets based on category (updated, pending, etc.)
  const handleNavigation = (category) => {
    switch (category) {
      case 'updated':
        navigate('/assets/updated');  // Navigate to the updated assets page
        break;
      case 'pending':
        navigate('/assets/deleted');  // Navigate to the deleted assets page (which you referred to as pending approval)
        break;
      case 'all':
      default:
        navigate('/assets');  // Navigate to all assets
        break;
    }
  };

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
      <h2 className="text-center mb-4">Asset Statistics</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Total Assets</Card.Title>
              <Card.Text>{stats.total_assets}</Card.Text>
              <Button variant="primary" onClick={() => handleNavigation('')}>
                View All Assets
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Updated Assets</Card.Title>
              <Card.Text>{stats.updated_assets}</Card.Text>
              <Button variant="success" onClick={() => handleNavigation('updated')}>
                View Updated Assets
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Deleted Assets</Card.Title>
              <Card.Text>{stats.pending_approval_assets}</Card.Text>
              <Button variant="warning" onClick={() => handleNavigation('pending')}>
                View Deleted Assets
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AssetStats;
