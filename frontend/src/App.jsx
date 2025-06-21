// App.jsx
import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './adminlogin';
import UserLogin from './Userlogin';
import Scanner from './scanner';
import Home from './home';
import Login from './login';
import './index.css';

function App() {
  const navigate = useNavigate();  
  const [login, setLogin] = useState(false);

  const handleuser = async (user, password) => {
    try {
      const response = await axios.post("https://attendance-app-gqu0.onrender.com/api/users/login", {
        email: user,
        mobile: password,
      });
      if (response.status === 200) {
        setLogin(true);
        localStorage.setItem('user', user);
        navigate('/scanner');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlescan = async (result) => {
    try {
      const user = localStorage.getItem('user');
      const fp = await FingerprintJS.load();
      const device = (await fp.get()).visitorId;
      const response = await axios.post("https://attendance-app-gqu0.onrender.com/api/users/update", {
        username: user,
        date: result,
        device: device
      });
      if (response.status === 200) {
        alert('Your attendance has been saved');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleadmin = async (user, password) => {
    try {
      const response = await axios.post("https://attendance-app-gqu0.onrender.com/api/admins", {
        username: user,
        password: password,
      });
      if (response.status === 200) {
        setLogin(true);
        localStorage.setItem('admin', user);
        navigate('/AdminDashboard');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlelogout = () => {
    setLogin(false);
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      navigate('/');
    }
    if (localStorage.getItem('admin')) {
      localStorage.removeItem('admin');
      navigate('/');
    }
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
    <div>
      <div className="bg-blue-800 p-4 text-white flex justify-between items-center">
        <h1 className="text-lg font-semibold">Smart Attendance</h1>
        {login && (
          <div
            onClick={handlelogout}
            className="hover:bg-blue-600 cursor-pointer px-4 py-2 rounded"
          >
            Logout
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Home onUserLogin={handleuser} onAdminLogin={handleadmin} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scanner" element={<Scanner onscan={handlescan} />} />
        <Route path="/AdminDashboard/*" element={<AdminDashboard />} />
        <Route path="/adminlogin" element={<AdminLogin onadmin={handleadmin} />} />
        <Route path="/userlogin" element={<UserLogin onuser={handleuser} />} />
      </Routes>
    </div>
  );
}

export default App;
