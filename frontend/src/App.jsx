import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './adminlogin';
import UserLogin from './Userlogin';
import Scanner from'./scanner';
import Home from './home';
import './index.css';

function App() {
    const navigate = useNavigate();  
    const [open, setOpen] = useState(false);
    const [login,setlogin] = useState(false);
    const handleuser = async (user,password) => {
        try {
            const response = await axios.post("https://attendance-app-gqu0.onrender.com/api/users/login", { email: user, mobile: password });
            if (response.status === 200) {
                setlogin(true);
                localStorage.setItem('user',user);
                navigate('/scanner');
            } else {
                console.log("error");
            }
            } catch (err) {
            console.log(err);
        }
    };
    const handlescan = async(result)=>{
      try {
        const user = localStorage.getItem('user');
          const response = await axios.post("https://attendance-app-gqu0.onrender.com/api/users/update",{username:user,date:result});
          if(response.status === 200){
            alert('your attendance has been saved');
          }
      }catch (err) {
          console.log(err);
      }
    }
    const handleadmin = async (user,password) => {
        try {
            const response = await axios.post("https://attendance-app-gqu0.onrender.com/api/admins", { username: user, password: password });
            if (response.status === 200) {
                setlogin(true);
                localStorage.setItem('admin',user);
                navigate('/AdminDashboard');
            } else {
                console.log("error");
            }
            }
         catch (err) {
            console.log(err);
        }
    };
    const handlelogout =()=>{
      setlogin(false);
      if(localStorage.getItem('user')){
        localStorage.removeItem('user');
        navigate('/userlogin');
      }
      if(localStorage.getItem('admin')){
        localStorage.removeItem('admin');
        navigate('/adminlogin');
      }
    }
    useEffect(()=>{
      const user = localStorage.getItem('user');
      const admin = localStorage.getItem('admin');
      if(user){
        navigate('/scanner');
        setlogin(true);
      }
      else if(admin){
        navigate('/AdminDashboard');
        setlogin(true);
      }
      else{
        setlogin(false);
      }
    },[navigate]);
    return (
    <div>
      <div className="relative flex gap-4 bg-blue-800">
        {!login && (<div
          onClick={()=>setOpen(true)}
          className="text-white rounded hover:bg-blue-600 hover:cursor-pointer p-2"
        >
          Login
        </div>
        )}
        {login && (<div onClick={handlelogout}
          className="text-white rounded hover:bg-blue-600 hover:cursor-pointer p-2"
          >
          Logout
          </div>)
        }
        {open && (
          <div className="absolute top-10 left-2 bg-gray-100 shadow-lg rounded-lg z-10 flex flex-col justify-center items-center">
            <Link
              to="/userlogin"
              onClick={() => setOpen(false)}
              className="block p-4 hover:bg-gray-200"
            >
              User
            </Link>
            <Link
              to="/adminlogin"
              onClick={() => setOpen(false)}
              className="block p-4 hover:bg-gray-200"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/scanner" element ={<Scanner onscan={handlescan}/>}/>
        <Route path="/AdminDashboard/*" element={<AdminDashboard />} />
        <Route path="/adminlogin" element={<AdminLogin onadmin={handleadmin} />} />
        <Route path="/userlogin" element={<UserLogin onuser={handleuser} />} />
      </Routes>
    </div>
  );
}

export default App;
