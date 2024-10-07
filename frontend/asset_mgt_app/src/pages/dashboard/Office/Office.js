import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS

const Offices = () => {
  const [offices, setOffices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
   // Track if the user is an admin

  // Get the base API URL from environment variables
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  // Function to get the token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Assuming the token is stored in localStorage
  };

  // Fetching the offices data and checking if the user is an admin
  useEffect(() => {
    const token = getAuthToken(); // Retrieve the token

    if (token) {
      // Fetch the current user data to determine if they are an admin
      axios
        .get(`${apiUrl}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        })
        .then((response) => {
          setIsAdmin(response.data.is_staff); // Set admin status based on API response
        })
        .catch((error) => {
          console.error('Error fetching user data!', error.response ? error.response.data : error.message);
        });
    }

    // Fetch offices
    axios
      .get(`${apiUrl}/office/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      })
      .then((response) => {
        setOffices(response.data.office || response.data); // Handle the response format
      })
      .catch((error) => {
        console.error('There was an error fetching the offices!', error.response ? error.response.data : error.message);
      });
  }, [apiUrl]);

  // Handling the delete action with confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = getAuthToken(); // Retrieve the token
        axios
          .delete(`${apiUrl}/office/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          })
          .then(() => {
            setOffices(offices.filter((office) => office.id !== id)); // Update the state after successful deletion
            Swal.fire('Deleted!', 'The office has been deleted.', 'success');
          })
          .catch(() => {
            Swal.fire('Error!', 'There was an error deleting the office.', 'error');
          });
      }
    });
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="text-center flex-grow-1">
                <h2 className="mb-0">Office</h2>
              </div>
              {isAdmin && ( // Only admins can see the "Add Office" button
                <Link to="/add-office" className="btn btn-primary btn-lg">
                  <FaPlus className="me-2" />
                  Add Office
                </Link>
              )}
            </div>

            <div className="row justify-content-center"> {/* Center the card row */}
              {offices.length > 0 ? (
                offices.map((office) => (
                  <div key={office.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-lg border-0" style={{ transition: 'transform 0.3s', borderRadius: '10px' }}>
                      <div className="card-body p-4 d-flex flex-column">
                        <Link
                          to={`/division-by-office/${office.id}`}
                          className="card-link text-decoration-none mb-3"
                          onClick={() => localStorage.setItem('officeName', office.name)}
                          style={{ color: '#343a40', textDecoration: 'none' }}
                        >
                          <h5 className="card-title fw-bold">{office.name}</h5>
                          <p className="card-text text-muted">Head: {office.head_of_office}</p>
                        </Link>

                        <div className="mt-auto d-flex justify-content-between">
                          {isAdmin && ( // Only admins can see the "Update" and "Delete" buttons
                            <>
                              <Link to={`/update-office/${office.id}`} className="btn btn-outline-primary btn-sm">
                                <FaEdit className="me-2" />
                                Update
                              </Link>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(office.id)}
                              >
                                <FaTrash className="me-2" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <div className="alert alert-warning p-4" role="alert">
                    <h4 className="alert-heading">No Offices Available</h4>
                    <p>It looks like there are no offices added yet. Click the button below to add one.</p>
                    {isAdmin && (
                      <Link to="/add-office" className="btn btn-primary btn-lg mt-3">
                        <FaPlus className="me-2" />
                        Add a New Office
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offices;
