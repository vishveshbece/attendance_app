import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './adminlogin';
import UserLogin from './Userlogin';
import Scanner from './scanner';
import Home from './home';
import Login from './login';
import './index.css';

// Base API URL
const API_BASE_URL = "https://attendance-app-gqu0.onrender.com";

function App() {
  const navigate = useNavigate();  
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleuser = async (email, mobile) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        mobile
      });
      
      if (response.data.success) {
        setLogin(true);
        localStorage.setItem('user', JSON.stringify({
          email,
          _id: response.data.user?._id,
          Name: response.data.user?.Name
        }));
        navigate('/scanner');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlescan = async (result) => {
    try {
      setLoading(true);
      setError('');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.post(`${API_BASE_URL}/api/attendance`, {
        userId: user._id,
        qrData: result
      });
      
      if (response.data.success) {
        alert('Your attendance has been recorded successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to record attendance');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to record attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleadmin = async (username, password) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_BASE_URL}/api/admins/login`, {
        username,
        password
      });
      
      if (response.data.success) {
        setLogin(true);
        localStorage.setItem('admin', username);
        navigate('/AdminDashboard');
      } else {
        throw new Error(response.data.message || 'Admin login failed');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlelogout = () => {
    setLogin(false);
    setError('');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    navigate('/');
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    const admin = localStorage.getItem('admin');
    
    if (user) {
      setLogin(true);
      navigate('/scanner');
    } else if (admin) {
      setLogin(true);
      navigate('/AdminDashboard');
    } else {
      setLogin(false);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-800 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold">Smart Attendance</h1>
          {login && (
            <button
              onClick={handlelogout}
              className="hover:bg-blue-600 cursor-pointer px-4 py-2 rounded transition-colors"
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      )}

      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/" element={
            <Home 
              onUserLogin={handleuser} 
              onAdminLogin={handleadmin} 
              loading={loading}
            />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/scanner" element={
            <Scanner 
              onscan={handlescan} 
              user={JSON.parse(localStorage.getItem('user') || '{}')} 
              loading={loading}
            />
          } />
          <Route path="/AdminDashboard/*" element={<AdminDashboard />} />
          <Route path="/adminlogin" element={
            <AdminLogin 
              onadmin={handleadmin} 
              loading={loading}
            />
          } />
          <Route path="/userlogin" element={
            <UserLogin 
              onuser={handleuser} 
              loading={loading}
            />
          } />
        </Routes>
      </main>

      <footer className="bg-gray-100 p-4 text-center">
        <p>© {new Date().getFullYear()} Smart Attendance System</p>
      </footer>
    </div>
  );
}

export default App;