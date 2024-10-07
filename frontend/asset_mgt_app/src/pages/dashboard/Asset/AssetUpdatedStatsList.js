import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const AssetUpdatedStatsList = () => {
  const [updatedAssets, setUpdatedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdatedAssets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/assets/updated/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpdatedAssets(response.data); // Successfully fetched data
      } catch (error) {
        setError('Error fetching updated assets.'); // Handle fetch error
      } finally {
        setLoading(false); // Hide loading spinner once data is loaded
      }
    };

    fetchUpdatedAssets();
  }, [token, apiUrl]);

  const generatePDF = (asset) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString(); // Get the current date and time
    doc.text('Asset Update Approval', 20, 20);
    doc.text(`Asset Name: ${asset.name}`, 20, 30);
    doc.text(`Asset Number: ${asset.asset_number}`, 20, 40);
    doc.text(`Reason for Update: ${asset.pendingAndUpdated_desc}`, 20, 50);
    doc.text(`Date Approved: ${date}`, 20, 60);
    doc.save(`${asset.asset_number}_approval.pdf`);
  };

  const handleApprove = (asset) => {
    Swal.fire({
      title: 'Generate PDF and approve update?',
      text: 'You need to generate the PDF before approving the update.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Generate PDF',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Generate PDF with the current date and time
        generatePDF(asset);

        // Call API to approve the asset update (set is_updated to false)
        axios.put(`${apiUrl}/assets/${asset.id}/approve/`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          // Remove the asset from the UI upon approval
          setUpdatedAssets(updatedAssets.filter((item) => item.id !== asset.id));
          Swal.fire('Approved!', 'The asset update has been approved.', 'success');
        })
        .catch(() => {
          Swal.fire('Error!', 'There was an error approving the asset update.', 'error');
        });
      }
    });
  };

  const handleReject = (assetId) => {
    // Redirect to the asset update page upon rejection
    navigate(`/update-asset/${assetId}`);
  };

  // Loading spinner while data is being fetched
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // Error message if something goes wrong
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Show message when there are no updated assets
  if (updatedAssets.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info">There are no updated assets at the moment.</Alert>
      </Container>
    );
  }

  // Displaying the updated assets in a card layout
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
                <Card.Text>Status: {asset.asset_status}</Card.Text>
                {asset.pendingAndUpdated_desc && (
                  <Card.Text>Reason For Update: {asset.pendingAndUpdated_desc}</Card.Text>
                )}
                <Card.Footer>
                  <Button variant="primary" onClick={() => handleApprove(asset)}>
                    Approve
                  </Button>
                  <Button variant="danger" className="ml-2" onClick={() => handleReject(asset.id)}>
                    Reject
                  </Button>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AssetUpdatedStatsList;
