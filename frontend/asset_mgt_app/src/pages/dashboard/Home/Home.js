
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import CountUp from 'react-countup';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Home = () => {
  const [troubleshooting, setTroubleshooting] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [inActiveAssets, setInActiveAssets] = useState(0);
  const [divisions, setDivisions] = useState(0);
  const [maintenanceRecords, setMaintenanceRecords] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [categoryData, setCategoryData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_BACKEND_URL
  const [assetStats, setAssetStats] = useState({
    total_assets: 0,
    updated_assets: 0,
    pending_approval_assets: 0,
  });

  const navigate = useNavigate();

  const getAuthToken = () => {
    return localStorage.getItem('token');
    
  };

  const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
  };

  const saveAuthToken = (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const removeAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const refreshToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token found');
      
      const response = await axios.post(`${apiUrl}/auth/jwt/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      saveAuthToken(access, refreshToken);
      return access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      removeAuthToken();
      navigate('/login'); // Redirect to login on failure
    }
  };

  const fetchWithToken = async (url, method = 'get', data = null) => {
    try {
      let token = getAuthToken();
      if (!token) throw new Error('No token found');

      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      });

      return response;
    } catch (error) {
      // If the token is expired, refresh it and retry the request
      if (error.response && error.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          return await axios({
            method,
            url,
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
            data,
          });
        }
      } else {
        throw error;
      }
    }
  };

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        fetchTotalAssets(),
        fetchInActiveAssets(),
        fetchAssetNeedTroubleshooting(),
        fetchDivisions(),
        fetchMaintenanceRecords(),
        fetchCategoryData(),
        fetchAssetStats(),
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
        const response = await fetchWithToken(`${apiUrl}/users/me/`);
        setIsAdmin(response.data.is_staff);
        await fetchData();
      } catch (err) {
        setErrorMessage('Error fetching user data');
        setLoading(false);
        console.error(err);
        navigate('/login'); // Redirect to login on failure
      }
    };

    fetchUserData();
  }, [fetchData, navigate]);



  const fetchTotalAssets = async () => {
    const response = await fetchWithToken(`${apiUrl}/assets/`);
    setTotalAssets(response.data.length);
  };

   const fetchInActiveAssets = async () => {
    const response = await fetchWithToken(`${apiUrl}/assets/inactive/`);
    setInActiveAssets(response.data.length);
  };

  const fetchDivisions = async () => {
    const response = await fetchWithToken(`${apiUrl}/divisions/`);
    setDivisions(response.data.length);
  };

  const fetchMaintenanceRecords = async () => {
    const response = await fetchWithToken(`${apiUrl}/maintenances/`);
    setMaintenanceRecords(response.data.length);
  };

  const fetchCategoryData = async () => {
    const response = await fetchWithToken(`${apiUrl}/assets/category-distribution/`);
    setCategoryData(response.data);
  };

  const fetchAssetStats = async () => {
    const response = await fetchWithToken(`${apiUrl}/assets/asset-stats/`);
    setAssetStats(response.data);
  };

  const fetchAssetNeedTroubleshooting = async () => {
    const response = await fetchWithToken(`${apiUrl}/assets/need-troubleshooting/`);
    setTroubleshooting(response.data.length);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Category Distribution',
        data: Object.values(categoryData),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
      },
    ],
  };

  return (
    <div>
      <div className="content-wrapper">
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info"> 
                  <div className="inner">
                    <h3>
                      <CountUp end={totalAssets} duration={2} />
                    </h3>
                    <p>Total Assets</p>
                  </div>
                  <div className="icon">
                    <i className="nav-icon fas fa-warehouse" />
                  </div>
                  <Link to="/assets" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>
                      <CountUp end={divisions} duration={2} />
                    </h3>
                    <p>Total Divisions</p>
                  </div>
                  <div className="icon">
                    <i className="nav-icon fas fa-sitemap" />
                  </div>
                  <Link to="/division" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>
                      <CountUp end={maintenanceRecords} duration={2} />
                    </h3>
                    <p>Maintenance Records</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-clipboard" />
                  </div>
                  <Link to="/maintenance" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>
                      <CountUp end={troubleshooting} duration={2} />
                    </h3>
                    <p>Assets Need Troubleshooting</p>
                  </div>
                  <div className="icon">
                    <i className="nav-icon fas fa-tools" />
                  </div>
                  <Link to="/troubleshooting-assets" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                </div>
              </div>
            </div>

            {isAdmin && (
              <Row className="g-4">
                <Col md={4}>
                  <div className="small-box bg-primary">
                    <div className="inner">
                      <h3>
                        <CountUp end={inActiveAssets} duration={2} />
                      </h3>
                      <p>Inactive assets</p>
                    </div>
                    <div className="icon">
                      <i className="nav-icon fas fa-warehouse" />
                    </div>
                    <Link to="/assets/inactive/" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>
                        <CountUp end={assetStats.updated_assets} duration={2} />
                      </h3>
                      <p>Updated Assets</p>
                    </div>
                    <div className="icon">
                      <i className="nav-icon fas fa-check" />
                    </div>
                    <Link to="/assets/updated" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>
                        <CountUp end={assetStats.pending_approval_assets} duration={2} />
                      </h3>
                      <p>Assets waiting for approval</p>
                    </div>
                    <div className="icon">
                      <i className="nav-icon fas fa-clock" />
                    </div>
                    <Link to="/assets/deleted" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                  </div>
                </Col>
                
              </Row>
            )}

            <Row className="my-5">
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <Pie 
                      data={chartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }} 
                      style={{ height: '380px', width: '100%' }} // Adjust the height as needed
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <Bar data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

