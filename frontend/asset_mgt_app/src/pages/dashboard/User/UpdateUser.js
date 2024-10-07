import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import zxcvbn from 'zxcvbn'; // For password strength evaluation

const UpdateUser = () => {
  const { pk } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    is_staff: false,
    is_superuser: false,
    newPassword: '',     // New password
    confirmPassword: '', // Confirm new password
  });

  const [isAdmin, setIsAdmin] = useState(false); // Track if current user is an admin
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]); // Track new password validation errors
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [passwordStrength, setPasswordStrength] = useState(0); // Track password strength

  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setIsLoading(false);
          navigate('/login');
          return;
        }

        const currentUserResponse = await axios.get(`${apiUrl}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAdmin(currentUserResponse.data.is_staff);

        const userResponse = await axios.get(`${apiUrl}/users/${pk}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { username, email, first_name, last_name, is_staff, is_superuser } = userResponse.data;
        setFormData({
          username: username || '',
          email: email || '',
          first_name: first_name || '',
          last_name: last_name || '',
          is_staff: is_staff || false,
          is_superuser: is_superuser || false,
          newPassword: '',
          confirmPassword: '',
        });
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching user data.');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchUserData();
  }, [pk, token, navigate]);

  const validateNewPassword = (password) => {
    const errors = [];

    if (password.length > 0) {
      if (password.length < 6) errors.push('Password must be at least 6 characters long.');
      if (password.length > 16) errors.push('Password must not exceed 16 characters.');
      if (!/[A-Z]/.test(password)) errors.push('Password must include at least one uppercase letter.');
      if (!/[a-z]/.test(password)) errors.push('Password must include at least one lowercase letter.');
      if (!/[0-9]/.test(password)) errors.push('Password must include at least one numeric character.');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must include at least one special character.');
    }

    return errors;
  };

  const validateConfirmPassword = (newPassword, confirmPassword) => {
    if (confirmPassword && newPassword !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === 'newPassword') {
        const errors = validateNewPassword(value);
        setPasswordErrors(errors);
        const evaluation = zxcvbn(value);
        setPasswordStrength(evaluation.score);
      }
      if (name === 'confirmPassword') {
        const confirmError = validateConfirmPassword(formData.newPassword, value);
        if (confirmError) {
          setError(confirmError);
        } else {
          setError('');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.newPassword || formData.confirmPassword) {
      const newPasswordErrors = validateNewPassword(formData.newPassword);
      if (newPasswordErrors.length > 0) {
        setError(newPasswordErrors.join(' '));
        return;
      }

      const confirmPasswordError = validateConfirmPassword(formData.newPassword, formData.confirmPassword);
      if (confirmPasswordError) {
        setError(confirmPasswordError);
        return;
      }
    }

    const dataToSend = {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      is_staff: formData.is_staff,
      is_superuser: formData.is_superuser,
    };

    if (formData.newPassword) {
      dataToSend.newPassword = formData.newPassword;
    }

    try {
      const response = await axios.put(`${apiUrl}/users/${pk}/`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('User updated successfully!');
      setFormData({
        ...formData,
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => navigate('/user-list'), 2000);
    } catch (err) {
      setError('There was an error updating the user.');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Update User</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formFirstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formLastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formIsStaff" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Staff Member"
            name="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formIsSuperuser" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Superuser (Admin)"
            name="is_superuser"
            checked={formData.is_superuser}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formNewPassword" className="mb-3">
          <Form.Label>New Password (Leave blank if you don't want to change it)</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <ProgressBar
            striped
            variant={passwordStrength === 5 ? 'success' : passwordStrength === 4 ? 'warning' : 'danger'}
            now={(passwordStrength / 5) * 100}
            className="mt-2"
          />
          <small className="text-muted">
            {passwordErrors.length > 0 && passwordErrors.join(' ')}
          </small>
        </Form.Group>

        <Form.Group controlId="formConfirmPassword" className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update User
        </Button>
      </Form>
    </div>
  );
};

export default UpdateUser;
