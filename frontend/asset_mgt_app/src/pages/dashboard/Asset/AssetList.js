import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './AssetList.css';
import Modal from 'react-modal';

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

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // const [approvalRequests, setApprovalRequests] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAdmin(response.data.is_staff);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    const fetchAssets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/assets-list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssets(response.data);
      } catch (error) {
        setError('Error fetching assets');
      } finally {
        setLoading(false);
      }
    };

  

    fetchUserRole();
    fetchAssets();
    }, [token,apiUrl]);

  const handleDeleteAsset = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to recover this asset!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${apiUrl}/assets/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setAssets(assets.filter(asset => asset.id !== id));
          Swal.fire('Deleted!', 'Your asset has been deleted.', 'success');
        })
        .catch(() => {
          Swal.fire('Error!', 'There was an error deleting the asset.', 'error');
        });
      }
    });
  };

  const handleDeleteRequest = (id) => {
    Swal.fire({
      title: 'Are You Sure',
      text: 'AYou won\'t be able to recover this asset!',
      input: 'textarea',
      inputPlaceholder: 'Enter reason for deleting this asset...',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      preConfirm: (description) => {
        if (!description) {
          Swal.showValidationMessage('Please enter a reason for deletion');
        }
        return description;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`${apiUrl}/assets/${id}/delete-request/`, {
          description: result.value  // Send the description to the backend
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          // Remove the asset from the list for the user
          setAssets(assets.filter(asset => asset.id !== id));
          Swal.fire('Request Sent!', 'You have successfully requested deletion.', 'success');
        })
        .catch(() => {
          Swal.fire('Error!', 'There was an error while requesting deletion.', 'error');
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

  // Only show assets that are not pending if the user is not an admin
  const filteredAssets = assets.filter(asset =>
    asset.asset_number.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (isAdmin || !asset.is_pending)
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Asset List', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Serial Number', 'Asset Number', 'Name', 'Category', 'Division', 'Specification', 'Model Number', 'Status']],
      body: filteredAssets.map((asset, index) => [
        index + 1,
        asset.asset_number,
        asset.name,
        categoryDisplayNames[asset.category],
        asset.issue_name || 'N/A',
        asset.specification || 'N/A',
        asset.model_number || 'N/A',
        asset.asset_status_display || 'N/A',
      ]),
    });
    doc.save('asset_list.pdf');
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="asset-list-container">
            <h2>Asset List</h2>

            <input
              type="text"
              placeholder="Search by asset number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />

            <div className="download-buttons">
              <button className="btn btn-secondary mb-3" onClick={downloadPDF}>
                Download Full Asset List PDF
              </button>
            </div>

            {isAdmin && (
              <div className="admin-only-section">
                <Link to="/waited-for-approval">
                  <button className="btn btn-primary mb-3">
                    View Waited For Approval Requests
                  </button>
                </Link>
              </div>
            )}

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="table-wrapper">
                <table className="maintenance-table">
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>Asset Number</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Division</th>
                      <th>Specification</th>
                      <th>Model Number</th>
                      <th>Status</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset, index) => (
                        <tr key={asset.id}>
                          <td>{index + 1}</td>
                          <td>{asset.asset_number}</td>
                          <td>{asset.name}</td>
                          <td>{categoryDisplayNames[asset.category]}</td>
                          <td>{asset.issue_name || 'N/A'}</td>
                          <td>{asset.specification || 'N/A'}</td>
                          <td>{asset.model_number || 'N/A'}</td>
                          <td>{asset.asset_status_display || 'N/A'}</td>
                          <td>
                            {asset.image ? (
                              <button onClick={() => openModal(`http://127.0.0.1:8000${asset.image}`)} className="view-image-btn">
                                <FaEye /> View Image
                              </button>
                            ) : (
                              'No Image'
                            )}
                          </td>
                          <td>
                            {isAdmin ? (
                              <button onClick={() => handleDeleteAsset(asset.id)} className="delete-btn">
                                <FaTrash /> Delete
                              </button>
                            ) : (
                              <button onClick={() => handleDeleteRequest(asset.id)} className="delete-btn">
                                <FaTrash /> Delete
                              </button>
                            )}
                            <Link to={`/update-asset/${asset.id}`} className="edit-btn">
                              <FaEdit /> Update
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10">No assets found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Notification Section */}
            {isAdmin && showNotification && (
              <div className="notification">
                {/* <FaBell /> You have {approvalRequests.length} approval request(s). */}
                <button onClick={() => setShowNotification(false)}>Dismiss</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Image Modal"
      >
        <button onClick={closeModal} className="close-modal-btn">Close</button>
        {selectedImage && <img src={selectedImage} alt="Asset" className="modal-image" />}
      </Modal>
    </div>
  );
};

export default AssetList;
