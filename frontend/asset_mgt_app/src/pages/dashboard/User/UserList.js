import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './UserList.css';
import Modal from 'react-modal';

// Define custom styles for the modal
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // Store current user's ID

  const navigate = useNavigate(); // Use navigate to redirect

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Fetch user data to determine if the user is an admin
    axios.get(`${apiUrl}/users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setIsAdmin(response.data.is_staff);
      setCurrentUserId(response.data.id); // Store the current user's ID
      // Fetch users based on role
      fetchUsers(response.data.is_staff, response.data.id);
    })
    .catch(err => {
      setError('Error fetching user data');
      setLoading(false);
    });
  }, [token]);

  const fetchUsers = (isAdmin, currentUserId) => {
    axios.get(`${apiUrl}/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      if (isAdmin) {
        setUsers(response.data);
      } else {
        // Filter to show only the logged-in user if not an admin
        setUsers(response.data.filter(user => user.id === currentUserId));
      }
      setLoading(false);
    })
    .catch(err => {
      setError('Error fetching users');
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${apiUrl}/users/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setUsers(users.filter(user => user.id !== id));
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        })
        .catch(() => {
          Swal.fire('Error!', 'There was an error deleting the user.', 'error');
        });
      }
    });
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

  const redirectToUpdateUser = (id) => {
    navigate(`/update-user/${id}`);
  };

  return (
    <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
    <div className="user-list-container">
      <h2>User List</h2>

      {isAdmin && (
        <div className="add-user-btn-wrapper">
          <Link to="/add-user" className="btn btn-primary">
            Add User
          </Link>
        </div>
      )}

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={isAdmin ? "3" : "2"}>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={isAdmin ? "3" : "2"}>{error}</td></tr>
            ) : users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  {isAdmin || user.id === currentUserId ? ( // Show actions for admin or current user
                    <td>
                      <FaEdit
                        title="Edit"
                        className="icon edit-icon"
                        onClick={() => redirectToUpdateUser(user.id)}
                      />
                      {isAdmin && (
                        <FaTrash
                          title="Delete"
                          className="icon delete-icon"
                          onClick={() => handleDelete(user.id)}
                        />
                      )}
                      <button onClick={() => openModal(user)} className="view-details-btn">
                        Details
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? "3" : "2"}>No users available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing user details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="User Details"
      >
        <h2>User Details</h2>
        {selectedUser && (
          <div className="user-details-modal">
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>First Name:</strong> {selectedUser.first_name}</p>
            <p><strong>Last Name:</strong> {selectedUser.last_name}</p>
          </div>
        )}
        <button onClick={closeModal} className="close-modal-btn">Close</button>
      </Modal>
    </div>
    </div>
    </div>
    </div>
  );
};

export default UserList;
