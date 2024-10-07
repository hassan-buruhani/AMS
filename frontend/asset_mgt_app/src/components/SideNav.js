import React, { useContext, useEffect, useState } from 'react'; 
import axios from 'axios';
import { AuthContext } from '../AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

function SideNav() {
  const { user } = useContext(AuthContext);
  const [divisions, setDivisions] = useState([]);
  const [offices, setOffices] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/divisions/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDivisions(response.data);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };

    const fetchOffices = async () => {
      try {
        const response = await axios.get(`${apiUrl}/offices/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOffices(response.data);
      } catch (error) {
        console.error('Error fetching offices:', error);
      }
    };

    fetchDivisions();
    fetchOffices();
  }, [apiUrl]);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    setActiveSection(dropdownName === 'dashboard' ? 'dashboard' : dropdownName);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/logout/`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      localStorage.removeItem('token');
      sessionStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderUserInitial = () => {
    if (user && user.first_name) {
      return (
        <div style={styles.userInitial}>
          {user.first_name[0].toUpperCase()}
        </div>
      );
    }
    return null;
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <div className="sidebar">
        <div style={styles.userPanel}>
          <div style={styles.image}>
            {renderUserInitial()}
          </div>
          <div style={styles.info}>
            <p style={styles.userName}>{user && user.first_name}</p>
          </div>
          <div style={styles.divider} />
        </div>
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/* Dashboard */}
            <li className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}>
              <Link to="/" className="nav-link" onClick={() => setActiveSection('dashboard')}>
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>Dashboard</p>
              </Link>
            </li>

            {/* Offices */}
            <li className={`nav-item ${activeDropdown === 'offices' ? 'menu-open' : ''}`}>
              <button className="nav-link" onClick={() => toggleDropdown('offices')}>
                <i className="nav-icon fas fa-building"></i>
                <p>
                  Offices
                  <i className={`fas fa-angle-left right ${activeDropdown === 'offices' ? 'rotate' : ''}`} />
                </p>
              </button>
              <ul className={`nav nav-treeview ${activeDropdown === 'offices' ? 'd-block' : 'd-none'}`}>
                <li className="nav-item">
                  <Link to="/office" className="nav-link" onClick={() => setActiveSection('offices')}>
                    <i className="far fa-circle nav-icon"></i>
                    <p style={styles.navText}>View All Offices</p>
                  </Link>
                </li>
                {user && user.is_admin && (
                  <li className="nav-item">
                    <Link to="/add-office" className="nav-link" onClick={() => setActiveSection('offices')}>
                      <i className="far fa-circle nav-icon"></i>
                      <p style={styles.navText}>Add Office</p>
                    </Link>
                  </li>
                )}
                {offices.length > 0 ? (
                  offices.map((office) => (
                    <li key={office.id} className="nav-item">
                      <Link to={`/office-details/${office.id}`} className="nav-link" onClick={() => setActiveSection('offices')}>
                        <i className="far fa-circle nav-icon"></i>
                        <p style={styles.navText}>{office.name}</p>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="nav-item">
                    <button className="nav-link" disabled>
                      <i className="far fa-circle nav-icon"></i>
                      <p>No Offices Available</p>
                    </button>
                  </li>
                )}
              </ul>
            </li>

            {/* Divisions */}
            <li className={`nav-item ${activeDropdown === 'divisions' ? 'menu-open' : ''}`}>
              <button className="nav-link" onClick={() => toggleDropdown('divisions')}>
                <i className="nav-icon fas fa-sitemap"></i>
                <p>
                  <Link to= '/division' style={styles.navText}>Divisions</Link>
                  <i className={`fas fa-angle-left right ${activeDropdown === 'divisions' ? 'rotate' : ''}`} />
                </p>
              </button>
              <ul className={`nav nav-treeview ${activeDropdown === 'divisions' ? 'd-block' : 'd-none'}`}>
                {divisions.length > 0 ? (
                  divisions.map((division) => (
                    <li key={division.id} className="nav-item">
                      <Link to={`/assets-by-division/${division.id}`} className="nav-link" onClick={() => setActiveSection('divisions')}>
                        <i className="far fa-circle nav-icon"></i>
                        <p style={styles.navText}>{division.name}</p>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="nav-item">
                    <button className="nav-link" disabled>
                      <i className="far fa-circle nav-icon"></i>
                      <p>No Divisions Available</p>
                    </button>
                  </li>
                )}
              </ul>
            </li>

            {/* Maintenance */}
            <li className={`nav-item ${activeDropdown === 'maintenance' ? 'menu-open' : ''}`}>
              <button className="nav-link" onClick={() => toggleDropdown('maintenance')}>
                <i className="nav-icon fas fa-tools"></i>
                <p>
                  Maintenance
                  <i className={`fas fa-angle-left right ${activeDropdown === 'maintenance' ? 'rotate' : ''}`} />
                </p>
              </button>
              <ul className={`nav nav-treeview ${activeDropdown === 'maintenance' ? 'd-block' : 'd-none'}`}>
                <li className="nav-item">
                  <Link to="/troubleshooting-assets" className="nav-link" onClick={() => setActiveSection('maintenance')}>
                    <i className="far fa-circle nav-icon"></i>
                    <p style={styles.navText}>Assets Needing Troubleshooting</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/maintenance" className="nav-link" onClick={() => setActiveSection('maintenance')}>
                    <i className="far fa-circle nav-icon"></i>
                    <p style={styles.navText}>Maintenance Log</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/new-maintenance" className="nav-link" onClick={() => setActiveSection('maintenance')}>
                    <i className="far fa-circle nav-icon"></i>
                    <p style={styles.navText}>New Maintenance Record</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Assets */}
            <li className={`nav-item ${activeDropdown === 'assets' ? 'menu-open' : ''}`}>
              <button className="nav-link" onClick={() => toggleDropdown('assets')}>
                <i className="nav-icon fas fa-boxes"></i>
                <p>
                  Assets
                  <i className={`fas fa-angle-left right ${activeDropdown === 'assets' ? 'rotate' : ''}`} />
                </p>
              </button>
              <ul className={`nav nav-treeview ${activeDropdown === 'assets' ? 'd-block' : 'd-none'}`}>
                <li className="nav-item">
                  <Link to="/assets" className="nav-link" onClick={() => setActiveSection('assets')}>
                    <i className="far fa-circle nav-icon"></i>
                    <p style={styles.navText}>Asset List</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/add-asset" className="nav-link" onClick={() => setActiveSection('assets')}>
                    <i className="far fa-circle nav-icon"></i>
                    <p style={styles.navText}>Add Asset</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* User Management */}
            {user && user.is_admin && (
              <li className={`nav-item ${activeDropdown === 'userManagement' ? 'menu-open' : ''}`}>
                <button className="nav-link" onClick={() => toggleDropdown('userManagement')}>
                  <i className="nav-icon fas fa-user-cog"></i>
                  <p>
                    User Management
                    <i className={`fas fa-angle-left right ${activeDropdown === 'userManagement' ? 'rotate' : ''}`} />
                  </p>
                </button>
                <ul className={`nav nav-treeview ${activeDropdown === 'userManagement' ? 'd-block' : 'd-none'}`}>
                  <li className="nav-item">
                    <Link to="/manage-users" className="nav-link" onClick={() => setActiveSection('userManagement')}>
                      <i className="far fa-circle nav-icon"></i>
                      <p style={styles.navText}>Manage Users</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/add-user" className="nav-link" onClick={() => setActiveSection('userManagement')}>
                      <i className="far fa-circle nav-icon"></i>
                      <p style={styles.navText}>Add User</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Logout */}
            <li className="nav-item">
              <button className="nav-link" onClick={handleLogout}>
                <i className="nav-icon fas fa-sign-out-alt" />
                <p>Logout</p>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

const styles = {
  userPanel: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
  },
  image: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
  },
  userInitial: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000',
  },
  info: {
    flexGrow: 1,
  },
  userName: {
    margin: 0,
    fontSize: '14px',
    color: '#fff',
  },
  divider: {
    borderTop: '1px solid #ccc',
    margin: '10px 0',
  },
  navText: {
    fontSize: '14px',
    color: '#fff',
  },
};

export default SideNav;
