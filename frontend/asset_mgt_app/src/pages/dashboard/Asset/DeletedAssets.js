import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import jsPDF from 'jspdf'; // Import jsPDF
import moment from 'moment'; // Import moment.js for date formatting

const DeletedAssets = () => {
  const [deletedAssets, setDeletedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(null); // Store the current date and time
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  

  useEffect(() => {
    const fetchDeletedAssets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/assets/deleted/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDeletedAssets(response.data);
      } catch (error) {
        setError('Error fetching deleted assets.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedAssets();
  }, [token, apiUrl]);

  // Generate PDF using asset details and current date and time
  const generatePDF = (asset) => {
    const doc = new jsPDF();
    const dateNow = moment().format('MMMM Do YYYY, h:mm:ss a'); // Capture current date and time
    doc.text('Asset Deletion Request', 20, 20);
    doc.text(`Asset Name: ${asset.name}`, 20, 30);
    doc.text(`Asset Number: ${asset.asset_number}`, 20, 40);
    doc.text(`Reason for Deletion: ${asset.pendingAndUpdated_desc}`, 20, 50);
    doc.text(`Deleted At: ${dateNow}`, 20, 60); // Use React date for deletion timestamp
    doc.save(`${asset.asset_number}_deletion.pdf`);

    // Set the current date and time for display in UI
    setCurrentTime(dateNow);
  };

  const handleDelete = (asset) => {
    Swal.fire({
      title: 'Generate PDF before deletion?',
      text: 'You need to generate the PDF before approving the deletion.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Generate PDF',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        generatePDF(asset);

        Swal.fire({
          title: 'Are you sure?',
          text: 'This action will delete the asset permanently!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        }).then((deleteResult) => {
          if (deleteResult.isConfirmed) {
            axios
              .delete(`${apiUrl}/assets/${asset.id}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(() => {
                setDeletedAssets(deletedAssets.filter((item) => item.id !== asset.id));
                Swal.fire('Deleted!', 'The asset has been deleted.', 'success');
              })
              .catch(() => {
                Swal.fire('Error!', 'There was an error deleting the asset.', 'error');
              });
          }
        });
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will reject the delete request and keep the asset active.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${apiUrl}/assets/${id}/reject/`, { is_pending: false }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setDeletedAssets(deletedAssets.filter((asset) => asset.id !== id));
            Swal.fire('Rejected!', 'The delete request has been rejected.', 'success');
          })
          .catch(() => {
            Swal.fire('Error!', 'There was an error rejecting the delete request.', 'error');
          });
      }
    });
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

  // Show message when there are no deleted assets
  if (deletedAssets.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info">There are no deleted assets at the moment.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Deleted Assets</h2>
      <Row>
        {deletedAssets.map((asset) => (
          <Col key={asset.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{asset.name}</Card.Title>
                <Card.Text>Asset Number: {asset.asset_number}</Card.Text>

                {asset.pendingAndUpdated_desc && (
                  <Card.Text>Reason For Deletion: {asset.pendingAndUpdated_desc}</Card.Text>
                )}

                {/* Display the current time if the asset was deleted */}
                {currentTime && (
                  <Card.Text>Deleted At: {currentTime}</Card.Text>
                )}

                <div className="d-flex justify-content-between mt-3">
                  <Button variant="danger" onClick={() => handleDelete(asset)}>
                    Approve
                  </Button>
                  <Button variant="primary" onClick={() => handleReject(asset.id)}>
                    Reject
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DeletedAssets;
