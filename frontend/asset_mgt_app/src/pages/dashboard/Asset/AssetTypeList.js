import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SideBar from './SideBar';
import './AssetTypeList.css';

const AssetTypeList = () => {
  const { id, type } = useParams(); // Get division ID and type from the URL
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState(null);

  // Get the token from localStorage
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Fetch assets from backend with authentication token
    axios.get(`${apiUrl}/division/${id}/assets/type/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setAssets(response.data);
        setError(null); // Clear any previous errors
      })
      .catch(error => {
        setError('There was an error fetching the assets!');
        console.error('Error:', error);
      });
  }, [id, type, token]); // Include token in the dependency array

  return (
    <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
    <div className="asset-type-container">
      <SideBar /> {/* Sidebar component */}
      <div className="main-content">
        <h2 className="asset-type-title">Assets of Type: {type}</h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="asset-type-grid">
            {assets.length > 0 ? (
              assets.map(asset => (
                <div key={asset.id} className="asset-type-card">
                  <h3>{asset.name}</h3>
                  <p>Category: {asset.category}</p>
                  <p>Location: {asset.location}</p>
                  <p>Cost: {asset.cost}</p>
                  <p>Status: {asset.asset_status}</p>
                  {asset.specification && <p>Specification: {asset.specification}</p>}
                  {asset.model_number && <p>Model: {asset.model_number}</p>}
                  {/* Add other asset details as needed */}
                </div>
              ))
            ) : (
              <p>No assets available for this type.</p>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default AssetTypeList;
