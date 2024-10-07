import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS

const Divisions = () => {
  const [divisions, setDivisions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin

  // Get the base API URL from environment variables
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  // Function to get the token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Assuming the token is stored in localStorage
  };

  // Fetching the divisions data and checking if the user is an admin
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

    // Fetch divisions
    axios
      .get(`${apiUrl}/divisions/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      })
      .then((response) => {
        setDivisions(response.data.divisions || response.data); // Handle the response format
      })
      .catch((error) => {
        console.error('There was an error fetching the divisions!', error.response ? error.response.data : error.message);
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
          .delete(`${apiUrl}/divisions/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          })
          .then(() => {
            setDivisions(divisions.filter((division) => division.id !== id)); // Update the state after successful deletion
            Swal.fire('Deleted!', 'The division has been deleted.', 'success');
          })
          .catch(() => {
            Swal.fire('Error!', 'There was an error deleting the division.', 'error');
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
        <h2 className="mb-0">Divisions</h2>
        {isAdmin && ( // Only admins can see the "Add Division" button
          <Link to="/add-division" className="btn btn-primary btn-lg">
            <FaPlus className="me-2" />
            Add Division
          </Link>
        )}
      </div>

      <div className="row">
        {divisions.length > 0 ? (
          divisions.map((division) => (
            <div key={division.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg border-0" style={{ transition: 'transform 0.3s', borderRadius: '10px' }}>
                <div className="card-body p-4 d-flex flex-column">
                  <Link
                    to={`/assets-by-division/${division.id}`}
                    className="card-link text-decoration-none mb-3"
                    onClick={() => localStorage.setItem('divisionName', division.name)}
                    style={{ color: '#343a40', textDecoration: 'none' }}
                  >
                    <h5 className="card-title fw-bold">{division.name}</h5>
                    <p className="card-text text-muted">Head: {division.head_of_division}</p>
                  </Link>

                  <div className="mt-auto d-flex justify-content-between">
                    {isAdmin && ( // Only admins can see the "Update" and "Delete" buttons
                      <>
                        <Link to={`/update-division/${division.id}`} className="btn btn-outline-primary btn-sm">
                          <FaEdit className="me-2" />
                          Update
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(division.id)}
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
              <h4 className="alert-heading">No Divisions Available</h4>
              <p>It looks like there are no divisions added yet. Click the button below to add one.</p>
              {isAdmin && (
                <Link to="/add-division" className="btn btn-primary btn-lg mt-3">
                  <FaPlus className="me-2" />
                  Add a New Division
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

export default Divisions;
