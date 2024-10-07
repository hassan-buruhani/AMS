import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS

const ForgotPasswordForm = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username) {
      Swal.fire({
        title: 'Error!',
        text: 'Username is required!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Submit username to backend
    axios.post(`${process.env.REACT_APP_BACKEND_URL}password-reset/`, { username })
      .then(response => {
        Swal.fire({
          title: 'Success!',
          text: 'If the username exists, a password reset link has been sent!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      })
      .catch(error => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error processing the request!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-12">
            <label htmlFor="username" className="form-label">Enter your Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">Reset Password</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
