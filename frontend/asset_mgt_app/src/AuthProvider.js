import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();
const apiUrl = process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false); // Tracks if the user is authenticated
    const [user, setUser] = useState(null);  // Stores user details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error message
    const navigate = useNavigate();

    // Logout function to clear session
    const logout = useCallback(() => {
        try {
            localStorage.removeItem('token');  // Remove token from localStorage
            setAuth(false);  // Set auth state to false
            setUser(null);  // Clear user data
            navigate('/login');  // Redirect to login page
        } catch (error) {
            console.error('Failed to logout:', error);
            setError('Failed to logout, please try again.'); // Set error message
        }
    }, [navigate]);  // Depend on navigate since it's from react-router

    // Function to fetch user details using the token
    const fetchUserDetails = useCallback(async (token) => {
        try {
            const response = await axios.get(`${apiUrl}/users/me/`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in headers
                },
            });
            setUser(response.data); // Set user data in state
        } catch (error) {
            console.error('Error fetching user details:', error);
            logout(); // If there's an error, log out the user
        } finally {
            setLoading(false); // Loading complete
        }
    }, [logout]);  // Add `logout` to dependency array

    // On initial load or refresh, check if there's a token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth(true);
            fetchUserDetails(token); // Call fetchUserDetails with token
        } else {
            setLoading(false); // No token, loading complete
        }
    }, [fetchUserDetails]); // Add fetchUserDetails as a dependency

    // Login function to store the token and user details
    const login = (token, userData) => {
        try {
            localStorage.setItem('token', token);  // Save token to localStorage
            setAuth(true);  // Set auth state to true
            setUser(userData);  // Set user details in state
            navigate('/');  // Navigate to home or another route
        } catch (error) {
            console.error('Failed to login:', error);
            setError('Failed to login, please try again.'); // Set error message
        }
    };

    return (
        <AuthContext.Provider value={{ auth, user, login, logout, loading, error }}>
            {!loading && children} {/* Render children only after loading is complete */}
        </AuthContext.Provider>
    );
};
