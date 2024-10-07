import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ResetPasswordForm = () => {
  const { uidb64, token } = useParams(); // Capture uid and token from URL
  const [new_password, setNewPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (new_password !== confirm_password) {
      setError("Passwords do not match!");
      return;
    }

    // Send the new password to the backend along with the token and uid
    axios.post(`${process.env.REACT_APP_BACKEND_URL}reset-password/${uidb64}/${token}/`, {
      new_password: new_password,
      confirm_password: confirm_password
    })
    .then((response) => {
      Swal.fire({
        title: 'Success!',
        text: 'Your password has been reset successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate('/login'); // Redirect to login page after successful reset
    })
    .catch((error) => {
      const errorMessage = error.response?.data?.error || 'Failed to reset the password. Please try again.';
      setError(errorMessage);
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Reset Your Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="new_password" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="new_password"
            value={new_password}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirm_password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="text-center">
          <button type="submit" className="btn btn-primary">Reset Password</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
