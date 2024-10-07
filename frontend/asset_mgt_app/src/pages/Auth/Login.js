import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthProvider';
import './Login.css'; 
import smz from '../../images/smz.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import icons

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    const { login } = useContext(AuthContext);
    const [error, setError] = useState('');

    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${baseUrl}/token/`, { username, password });
            const token = response.data.access;
            localStorage.setItem('token', token);

            const userResponse = await axios.get(`${baseUrl}/users/me/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            login(token, userResponse.data);

        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid Credentials');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="nsa-logo">
                    <img src={smz} alt="SMZ Logo" />
                </div>
                <h2 id='head-login'>Mkoa Kusini Unguja</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="login-input"
                            placeholder="Username"
                        />
                    </div>
                    <div className="form-group password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"} // Toggle between text and password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-input"
                            placeholder="Password"
                        />
                        <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <div className="login-footer">
                    <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
