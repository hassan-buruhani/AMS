import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import CountUp from 'react-countup';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Card, Row, Col, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register chart.js components
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Set up pdfMake to use the virtual file system for fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Home = () => {
  const [troubleshootingCount, setTroubleshootingCount] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [divisions, setDivisions] = useState(0);
  const [maintenanceRecords, setMaintenanceRecords] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [officeSupervisors, setOfficeSupervisors] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        fetchTroubleshootingCount(),
        fetchTotalAssets(),
        fetchDivisions(),
        fetchMaintenanceRecords(),
        fetchCategoryData(),
        fetchPendingRequests(),
        fetchTotalUsers(),
        fetchOfficeSupervisors(),
        fetchCategoriesCount(),
      ]);
      setLoading(false);
    } catch (error) {
      setErrorMessage('There was an error fetching data!');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAdmin(response.data.is_staff);
        await fetchData();
      } catch (err) {
        setErrorMessage('Error fetching user data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserData();
  }, [fetchData]);

  // API Calls (refactored for cleaner structure)
  const fetchTroubleshootingCount = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/assets/count-need-troubleshooting/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setTroubleshootingCount(response.data.count);
  };

  const fetchTotalAssets = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/assets/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setTotalAssets(response.data.length);
  };

  const fetchDivisions = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/divisions/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setDivisions(response.data.length);
  };

  const fetchMaintenanceRecords = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/maintenances/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setMaintenanceRecords(response.data.length);
  };

  const fetchPendingRequests = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pending-requests/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setPendingRequests(response.data.length);
  };

  const fetchTotalUsers = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setTotalUsers(response.data.length);
  };

  const fetchOfficeSupervisors = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/office-supervisors/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setOfficeSupervisors(response.data.length);
  };

  const fetchCategoriesCount = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/categories/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setCategoriesCount(response.data.length);
  };

  const fetchCategoryData = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/assets/category-distribution/`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    setCategoryData(response.data);
  };

  // Chart data
  const categoryLabels = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);

  const categoryBarData = {
    labels: categoryLabels.map(label => {
      const categoryNames = {
        COMP: 'Computer',
        PRIN: 'Printer',
        PHOTO: 'Photocopy Machine',
        MEZA: 'MEZA',
        KAB: 'KABATI',
        KIT: 'VITI',
        SOF: 'SOFA',
        OTHERS: 'Other Accessories',
      };
      return categoryNames[label] || label;
    }),
    datasets: [
      {
        label: 'Assets by Category',
        data: categoryValues,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#4D4D4D'],
      },
    ],
  };

  const troubleshootingData = {
    labels: ['Needs Troubleshooting', 'No Troubleshooting Needed'],
    datasets: [
      {
        label: 'Troubleshooting Status',
        data: [troubleshootingCount, totalAssets - troubleshootingCount],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div className="container">
      <Row className="mb-4">
        <Col lg={4} sm={6} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Assets</Card.Title>
              <h3><CountUp end={totalAssets} duration={2} /></h3>
              <Button variant="info" href="/division/:id/assets">More info</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} sm={6} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Office Supervisors</Card.Title>
              <h3><CountUp end={officeSupervisors} duration={2} /></h3>
              <Button variant="primary" href="/office-supervisors">More info</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} sm={6} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Maintenance Requests</Card.Title>
              <h3><CountUp end={maintenanceRecords} duration={2} /></h3>
              <Button variant="danger" href="/pending-maintenance">More info</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Bar data={categoryBarData} options={{ responsive: true, maintainAspectRatio: true }} />
        </Col>
        <Col lg={6}>
          <Pie data={troubleshootingData} options={{ responsive: true, maintainAspectRatio: true }} />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
