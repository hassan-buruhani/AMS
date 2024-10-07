import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './NewMaintenance.css'; // Import the CSS for styling

const NewMaintenance = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [formData, setFormData] = useState({
    asset: '',
    date: '',
    details: '',
    cost: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [errorAssets, setErrorAssets] = useState(null);
  const navigate = useNavigate();

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL; // Use the API URL from .env

  useEffect(() => {
    // Fetch assets
    axios.get(`${apiUrl}/assets/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setAssets(response.data);
        setFilteredAssets(response.data);
        setLoadingAssets(false);
      })
      .catch(() => {
        setErrorAssets('Error fetching assets');
        setLoadingAssets(false);
      });
  }, [token, apiUrl]);

  useEffect(() => {
    const filtered = assets.filter(asset =>
      asset.asset_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssets(filtered);
  }, [searchTerm, assets]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${apiUrl}/maintenances/`, {
      asset: formData.asset, // Send asset ID
      date: formData.date,
      details: formData.details,
      cost: formData.cost
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      Swal.fire('Success', 'Maintenance record added successfully', 'success');
      navigate('/maintenance'); // Redirect to maintenance list
    })
    .catch(() => {
      Swal.fire('Error', 'There was an error adding the maintenance record', 'error');
    });
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="new-maintenance-form">
            <h2>Add New Maintenance</h2>
            {loadingAssets ? (
              <p>Loading assets...</p>
            ) : errorAssets ? (
              <p>{errorAssets}</p>
            ) : (
              <>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search by asset number..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <label>
                    Asset Number:
                    <select
                      name="asset"
                      value={formData.asset}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select an asset</option>
                      {filteredAssets.map(asset => (
                        <option key={asset.id} value={asset.id}>
                          {asset.asset_number} {/* Display asset number */}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Details:
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Cost:
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      step="0.01"
                    />
                  </label>
                  <button type="submit">Add Maintenance</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMaintenance;
