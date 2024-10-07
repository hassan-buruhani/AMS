import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

const MaintenanceUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState({
    asset: '',
    date: '',
    details: '',
    cost: ''
  });
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState(null); // Added state for error handling
  const apiUrl = process.env.REACT_APP_BACKEND_URL; // Use the API URL from .env

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch maintenance data
    axios.get(`${apiUrl}/maintenances/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setMaintenance(response.data);
      })
      .catch(error => {
        console.error('Error fetching maintenance data!', error);
        setError('Failed to load maintenance data.');
      });

    // Fetch assets
    axios.get(`${apiUrl}/assets/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setAssets(response.data);
      })
      .catch(error => {
        console.error('Error fetching assets!', error);
        setError('Failed to load assets.');
      });
  }, [id, token, apiUrl]);

  const handleChange = (e) => {
    setMaintenance({
      ...maintenance,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${apiUrl}/maintenances/${id}/`, maintenance, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        Swal.fire('Success', 'Maintenance record updated successfully', 'success');
        navigate('/maintenance');
      })
      .catch(() => {
        Swal.fire('Error', 'There was an error updating the maintenance record', 'error');
      });
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="maintenance-update-container">
            <h2>Update Maintenance Record</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
              <label>
                Asset Number:
                <select
                  name="asset"
                  value={maintenance.asset}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an asset</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.asset_number}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={maintenance.date}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Details:
                <textarea
                  name="details"
                  value={maintenance.details}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Cost:
                <input
                  type="number"
                  name="cost"
                  value={maintenance.cost}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Update Maintenance</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceUpdate;
