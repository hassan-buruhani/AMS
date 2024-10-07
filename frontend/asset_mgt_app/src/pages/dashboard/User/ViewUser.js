import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Alert } from 'react-bootstrap';

const ViewUser = () => {
  const { pk } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/users/${pk}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    })
      .then(response => setUser(response.data))
      .catch(() => setError('Error fetching user details.'));
  }, [pk, token]);

  const handleDelete = () => {
    axios.delete(`${apiUrl}/users/${pk}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    })
      .then(() => navigate('/user-list'))
      .catch(() => setError('Error deleting user.'));
  };

  return (
    <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Details</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {user && (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>First Name:</strong> {user.first_name}</p>
          <p><strong>Last Name:</strong> {user.last_name}</p>
          <p><strong>Staff:</strong> {user.is_staff ? 'Yes' : 'No'}</p>
          <p><strong>Superuser:</strong> {user.is_superuser ? 'Yes' : 'No'}</p>

          <Button variant="warning" onClick={() => navigate(`/update-user/${pk}`)} className="me-3">Update</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      )}
    </div>
    </div>
    </div>
    </div>
  );
};

export default ViewUser;
