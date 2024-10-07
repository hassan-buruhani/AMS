import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS

const AddUser = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    is_staff: false,
    is_superuser: false,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]); // Track password validation errors
  const [passwordStrength, setPasswordStrength] = useState(0); // Track password strength

  // Function to get the token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
     // Assuming the token is stored in localStorage
  };

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];

    if (password.length > 0) { // Only validate if password is entered
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
      }

      if (password.length > 16) {
        errors.push('Password must not exceed 16 characters.');
      }

      if (!/[A-Z]/.test(password)) {
        errors.push('Password must include at least one uppercase letter.');
      }

      if (!/[a-z]/.test(password)) {
        errors.push('Password must include at least one lowercase letter.');
      }

      if (!/[0-9]/.test(password)) {
        errors.push('Password must include at least one numeric character.');
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must include at least one special character.');
      }
    }

    return errors;
  };

  // Simple password strength calculation based on criteria met
  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return strength; // Range from 0 to 6
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox toggles
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });

      // If the field is password, validate it in real-time
      if (name === 'password') {
        const errors = validatePassword(value);
        setPasswordErrors(errors);

        // Calculate password strength
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setPasswordErrors(passwordErrors);
      setErrorMessage(passwordErrors.join(' '));
      return;
    }

    const token = getAuthToken(); // Retrieve token

    try {
      const response = await axios.post(`${apiUrl}/users/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('User created successfully!');
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        is_staff: false,
        is_superuser: false,
      });
      setPasswordErrors([]);
      setPasswordStrength(0);
      setTimeout(() => navigate('/user-list'), 2000); // Redirect to user list after success
    } catch (error) {
      if (error.response && error.response.data) {
        // Display backend validation errors if any
        const backendErrors = Object.values(error.response.data).flat();
        setErrorMessage(backendErrors.join(' '));
      } else {
        setErrorMessage('There was an error creating the user.');
      }
      console.error(error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="container mt-5">
            <h2 className="text-center mb-4">Create New User</h2>

            {/* Button to redirect to the user list */}
            <div className="text-center mb-3">
              <Button 
                variant="primary" 
                onClick={() => navigate('/user-list')}
              >
                Show All Users
              </Button>
            </div>

            {/* Alerts for success or error messages */}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

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

              {/* Password field with validation and strength indicator */}
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Must be 6-16 characters, include uppercase, number, and special character"
                  isInvalid={passwordErrors.length > 0}
                />
                <Form.Text className="text-muted">
                  Password must be 6-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {passwordErrors.map((err, idx) => (
                    <div key={idx}>{err}</div>
                  ))}
                </Form.Control.Feedback>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <ProgressBar now={(passwordStrength / 6) * 100} variant={
                      passwordStrength <= 2 ? 'danger' :
                      passwordStrength === 3 ? 'warning' :
                      passwordStrength === 4 ? 'info' :
                      'success'
                    } />
                    <small className="text-muted">
                      {passwordStrength <= 2 && 'Weak'}
                      {passwordStrength === 3 && 'Fair'}
                      {passwordStrength === 4 && 'Good'}
                      {passwordStrength >= 5 && 'Strong'}
                    </small>
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="formIsStaff" className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Staff Member"
                  name="is_staff"
                  checked={formData.is_staff}
                  onChange={() => setFormData({ ...formData, is_staff: !formData.is_staff })}
                />
              </Form.Group>

              <Form.Group controlId="formIsSuperuser" className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Superuser"
                  name="is_superuser"
                  checked={formData.is_superuser}
                  onChange={() => setFormData({ ...formData, is_superuser: !formData.is_superuser })}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Add User
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
