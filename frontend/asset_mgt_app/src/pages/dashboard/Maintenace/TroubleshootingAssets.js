import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './TroubleshootingAssets.css';

const TroubleshootingAssets = () => {
  const [assets, setAssets] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_BACKEND_URL; // Use the API URL from .env

  useEffect(() => {
    // Fetch assets that need troubleshooting
    axios.get(`${apiUrl}/assets/need-troubleshooting/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    })
      .then(response => {
        setAssets(response.data);
      })
      .catch(error => {
        setErrorMessage('Error fetching assets that need troubleshooting');
        console.error('Error fetching assets:', error);
      });
  }, [token, apiUrl]); // Add token and apiUrl to dependency array

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Assets Needing Troubleshooting', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Asset Number', 'Name', 'Category', 'Cost', 'Model Number', 'Manufactured Date', 'Depreciation', 'Useful Life', 'Specification']],
      body: assets.map(asset => [
        asset.asset_number,
        asset.name,
        asset.category,
        asset.cost,
        asset.model_number || 'N/A',
        asset.manufactured_date,
        asset.depreciation,
        `${asset.useful_life} years`,
        asset.specification || 'N/A'
      ])
    });
    doc.save('assets_needing_troubleshooting.pdf');
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="troubleshooting-assets-container"> 
            <h2>Assets Needing Troubleshooting</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button className="btn btn-secondary mb-3" onClick={downloadPDF}>
              Download PDF
            </button>

            {assets.length > 0 ? (
              <table className="assets-table">
                <thead>
                  <tr>
                    <th>Asset Number</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Cost</th>
                    <th>Model Number</th>
                    <th>Useful Life</th>
                    <th>Specification</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.asset_number}>
                      <td>{asset.asset_number}</td>
                      <td>{asset.name}</td>
                      <td>{asset.category}</td>
                      <td>{asset.cost}</td>
                      <td>{asset.model_number || 'N/A'}</td>
                      {/* <td>{asset.depreciation}</td> */}
                      <td>{asset.useful_life} years</td>
                      <td>{asset.specification || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No assets need troubleshooting at this time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingAssets;
