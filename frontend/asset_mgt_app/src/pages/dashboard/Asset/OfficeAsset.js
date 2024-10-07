import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OfficeAsset = () => {
  const { id, name } = useParams(); // Get division ID and category (name) from the URL
  const [assets, setAssets] = useState([]);

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/division/${id}/assets/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    })
      .then(response => {
        const filteredAssets = response.data.filter(asset => {
          switch (name) {
            case 'computers':
              return asset.category === 'COMP';
            case 'furniture':
              return ['MEZA', 'KAB', 'KIT', 'SOF'].includes(asset.category);
            case 'printers':
              return asset.category === 'PRIN';
            case 'others':
              return !['COMP', 'PRIN', 'MEZA', 'KAB', 'KIT', 'SOF'].includes(asset.category);
            default:
              return false;
          }
        });

        setAssets(filteredAssets);
      })
      .catch(error => {
        console.error('There was an error fetching the assets!', error);
      });
  }, [id, name, token]); // Add token to dependency array

  return (
    <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
    <div className="office-assets">
      <h2>Assets: {name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      {assets.length > 0 ? (
        <ul>
          {assets.map(asset => (
            <li key={asset.id}>
              {asset.name} - {asset.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No assets found in this category.</p>
      )}
    </div>
    </div>
    </div>
    </div>
  );
};

export default OfficeAsset;
