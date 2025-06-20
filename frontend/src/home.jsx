import React from "react";
import { useNavigate } from "react-router-dom";  // <--- Import this
import { Button } from "./components/ui/button";
import { CalendarCheck, FileText, UserCircle } from "lucide-react";

function Home() {
  const navigate = useNavigate();  // <--- Initialize navigate

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-700 text-white py-6 shadow">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold">Attendance Tracker</h1>
          <p className="mt-2 md:mt-0 text-sm">Simple. Accurate. Reliable.</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">Welcome to Smart Attendance</h2>
            <p className="text-gray-600 mb-6">
              Streamline your daily attendance records with real-time tracking, secure access, and insightful reports.
            </p>
            
            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button>Get Started</Button>

              {/* Animated Login Button */}
              <button
                onClick={() => navigate("/login")}
                className="animate-bounce px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg
                  hover:scale-105 transform transition duration-300"
              >
                Login
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://unsplash.it/500/350?image=1062"
              alt="Attendance"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <CalendarCheck className="text-blue-600 mb-4 w-8 h-8" />
            <h3 className="text-xl font-semibold mb-2">Mark Attendance</h3>
            <p className="text-gray-600 text-sm">
              Quick and accurate marking with QR code or RFID.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <FileText className="text-green-600 mb-4 w-8 h-8" />
            <h3 className="text-xl font-semibold mb-2">View Records</h3>
            <p className="text-gray-600 text-sm">
              Access detailed attendance logs and reports anytime.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <UserCircle className="text-purple-600 mb-4 w-8 h-8" />
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600 text-sm">
              Add, remove, and manage staff and student profiles.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Attendance Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
