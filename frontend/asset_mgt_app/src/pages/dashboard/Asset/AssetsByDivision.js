import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import './AssetsByDivision.css'; // Using a unified stylesheet

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

const categoryDisplayNames = {
  COMP: 'Computer',
  PRIN: 'Printer',
  PHOTO: 'Photocopy Machine',
  MEZA: 'Meza',
  KAB: 'Kabati',
  KIT: 'Kiti',
  SOF: 'Sofa',
  OTHERS: 'Other Accessories',
};

const statusDisplayNames = {
  A: 'Active',
  B: 'Need Troubleshoot',
  C: 'Inactive',
};

const AssetsByDivision = () => {
  const { id } = useParams();  // Get the division ID from the URL
  const [assets, setAssets] = useState([]);
  const [divisionName, setDivisionName] = useState('');  // State to store the division name
  const [error, setError] = useState(null);  // State to handle errors
  const [searchTerm, setSearchTerm] = useState('');  // State for search term
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);  // State to store if the user is admin
  const [loading, setLoading] = useState(true);  // State to handle loading status

  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (id) {
      // Fetch current user data to determine if the user is an admin
      axios.get(`${apiUrl}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setIsAdmin(response.data.is_staff); // Check if user is admin
        setLoading(false); // Set loading to false after fetching user data

        // Fetch assets for the division
        axios.get(`${apiUrl}/assets/by_division/`, {
          params: { division_id: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          setAssets(response.data);
        })
        .catch(() => {
          setError('Failed to load assets.');
        });

        // Fetch division name
        axios.get(`${apiUrl}/divisions/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          setDivisionName(response.data.name);
          setError(null);
        })
        .catch(() => {
          setError('Failed to load division details.');
        });
      })
      .catch(() => {
        setError('Error fetching user data');
        setLoading(false);
      });
    }
  }, [id, apiUrl,token]);

  const handleDelete = (assetId) => {
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
        axios.delete(`${apiUrl}/assets/${assetId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setAssets(assets.filter(asset => asset.id !== assetId));
          Swal.fire('Deleted!', 'The asset has been deleted.', 'success');
        })
        .catch(() => {
          Swal.fire('Error!', 'There was an error deleting the asset.', 'error');
        });
      }
    });
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const filteredAssets = assets.filter(asset =>
    asset.asset_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
    <div className="assets-container">
      <h2 className="assets-title">ASSET AVAILABLE IN {divisionName} DIVISION</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by asset number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {error && <p className="assets-error">{error}</p>}

      <div className="table-wrapper">
        <table className="maintenance-table">
          <thead>
            <tr>
              <th>Asset Number</th>
              <th>Name</th>
              <th>Category</th>
              <th>Division</th>
              <th>Specification</th>
              <th>Model Number</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map(asset => (
                <tr key={asset.id}>
                  <td>{asset.asset_number}</td>
                  <td>{asset.name}</td>
                  <td>{categoryDisplayNames[asset.category]}</td>
                  <td>{asset.issue_name || 'N/A'}</td>
                  <td>{asset.specification || 'N/A'}</td>
                  <td>{asset.model_number || 'N/A'}</td>
                  <td>
                    {asset.image ? (
                      <button onClick={() => openModal(`${apiUrl}/${asset.image}`)} className="view-image-btn">
                        <FaEye /> View Image
                      </button>
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{statusDisplayNames[asset.asset_status]}</td>
                  <td>
                    {/* Conditional rendering based on isAdmin */}
                    {isAdmin ? (
                      <>
                        <Link to={`/update-asset/${asset.id}`}>
                          <FaEdit title="Edit" className="icon edit-icon" />
                        </Link>
                        <FaTrash
                          title="Delete"
                          className="icon delete-icon"
                          onClick={() => handleDelete(asset.id)}
                        />
                      </>
                    ) : (
                      <span>No Actions Available</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No assets available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing image */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="View Image"
      >
        <h2>Asset Image</h2>
        {selectedImage && <img src={selectedImage} alt="Asset" className="asset-image-modal" />}
        <button onClick={closeModal} className="close-modal-btn">Close</button>
      </Modal>

      {/* Admin-only add asset button */}
      {isAdmin && (
        <div className="add-asset-btn-container">
          <Link to={`/add-asset`} className="add-asset-btn">Add Asset</Link>
        </div>
      )}
    </div>
    </div>
    </div>
    </div>
  );
};

export default AssetsByDivision;
