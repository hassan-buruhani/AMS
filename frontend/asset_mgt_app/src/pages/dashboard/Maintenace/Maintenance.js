import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button, Container, Row, Col, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { debounce } from 'lodash';
import './Maintenance.css'; // Import your CSS file

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch maintenance data
    axios.get(`${apiUrl}/maintenances/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setMaintenanceData(response.data);
        setFilteredData(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        handleError('Error fetching maintenance data!');
        setIsLoading(false);
      });

    // Fetch current user data
    axios.get(`${apiUrl}/users/me/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setIsAdmin(response.data.is_admin);
      })
      .catch(() => handleError('Error fetching user data!'));
  }, []);

  const handleError = (message) => {
    Swal.fire({ title: 'Error', text: message, icon: 'error', confirmButtonText: 'OK' });
  };

  const handleSearch = debounce((event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredData(maintenanceData.filter(item => item.asset_name.toLowerCase().includes(value)));
  }, 300);

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
        const token = localStorage.getItem('token');
        axios.delete(`${apiUrl}/maintenances/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(() => {
            setMaintenanceData(maintenanceData.filter(item => item.id !== id));
            setFilteredData(filteredData.filter(item => item.id !== id));
            Swal.fire('Deleted!', 'The maintenance record has been deleted.', 'success');
          })
          .catch(() => handleError('There was an error deleting the maintenance record.'));
      }
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Maintenance Records', 10, 10);
    doc.autoTable({
      startY: 20,
      head: [['#', 'Asset', 'Date', 'Details', 'Cost']],
      body: maintenanceData.map((item, index) => [
        index + 1,
        item.asset_name,
        new Date(item.date).toLocaleDateString(),
        item.details,
        `TZS ${item.cost}`
      ])
    });
    doc.save('maintenance_records.pdf');
  };

  const handlePDFDownload = () => {
    Swal.fire({
      title: 'Download PDF?',
      text: 'This will download the maintenance records as a PDF file.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Download',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        generatePDF();
      }
    });
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="main-content">
            <h2 className="assets-title">Maintenance Records</h2>
            <div className="actions">
              {isAdmin && (
                <Link to="/new-maintenance" className="btn btn-primary me-2">NEW MAINTENANCE ACTIVITY</Link>
              )}
              <Button variant="secondary" onClick={handlePDFDownload}>Download PDF</Button>
            </div>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Control 
                  type="text" 
                  placeholder="Search by Asset Name" 
                  value={searchTerm} 
                  onChange={handleSearch} 
                />
              </Col>
            </Row>

            {isLoading ? (
              <div className="text-center">
                <span>Loading...</span>
              </div>
            ) : (
              <TableContent 
                isAdmin={isAdmin} 
                filteredData={filteredData} 
                handleDelete={handleDelete} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pass props to TableContent
const TableContent = ({ filteredData, handleDelete }) => (
  <div className="table-responsive">
    <Table striped bordered hover>
      <thead className="thead-dark">
        <tr>
          <th>#</th>
          <th>Asset</th>
          <th>Date</th>
          <th>Details</th>
          <th>Cost</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.asset_name}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.details}</td>
              <td>TZS {item.cost}</td>
              <td>
                <Link to={`/update-maintenance/${item.id}`} className="btn btn-outline-primary btn-sm">
                  <FaEdit /> Update
                </Link>
              </td>
              <td>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center">
              No Maintenance Records Available
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
);

export default Maintenance;
