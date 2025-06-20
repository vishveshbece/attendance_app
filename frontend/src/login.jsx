import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-12">Login Portal</h1>

      <div className="flex flex-col sm:flex-row gap-10 max-w-5xl w-full justify-center">
        {/* User Login Card */}
        <div
          className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center w-full sm:w-1/2
          transform transition-transform hover:scale-105 hover:shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
            alt="User Login"
            className="w-40 h-40 object-cover rounded-full mb-6"
          />
          <h2 className="text-xl font-semibold mb-4">User Login</h2>
          <p className="text-gray-600 mb-6 text-center px-2">
            Access your attendance dashboard and mark your attendance easily.
          </p>
          <button
            onClick={() => navigate("/userlogin")}
            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go to User Login
          </button>
        </div>

        {/* Admin Login Card */}
        <div
          className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center w-full sm:w-1/2
          transform transition-transform hover:scale-105 hover:shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80"
            alt="Admin Login"
            className="w-40 h-40 object-cover rounded-full mb-6"
          />
          <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
          <p className="text-gray-600 mb-6 text-center px-2">
            Manage users, attendance reports, and system settings here.
          </p>
          <button
            onClick={() => navigate("/adminlogin")}
            className="w-full py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
