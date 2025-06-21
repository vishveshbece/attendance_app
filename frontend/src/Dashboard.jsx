import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:7000";

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    Name: '',
    id: '',
    mobile: '',
    email: '',
    college: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addIntern = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate required fields
      if (!formData.Name || !formData.college || !formData.id || !formData.mobile || !formData.email) {
        throw new Error('All fields are required');
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/users`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        alert("Intern added successfully");
        setShowAddForm(false);
        setFormData({
          Name: '',
          id: '',
          mobile: '',
          email: '',
          college: ''
        });
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to add intern');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      
      if (response.data.success) {
        setRecords(response.data.users || []);
      } else {
        setError('Failed to fetch records');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const AddMemberForm = () => (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Add Intern</h3>
        
        {error && <p className="text-red-500 mb-3">{error}</p>}

        {[
          { name: 'Name', label: 'Full Name', type: 'text' },
          { name: 'college', label: 'College Name', type: 'text' },
          { name: 'id', label: 'ID Number', type: 'text' },
          { name: 'mobile', label: 'Mobile Number', type: 'tel' },
          { name: 'email', label: 'Email Address', type: 'email' }
        ].map((field, i) => (
          <div className="mb-3" key={i}>
            <label className="block text-gray-700 font-semibold mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <button
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          onClick={addIntern}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Intern'}
        </button>
        <button
          className="mt-3 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => setShowAddForm(false)}
          disabled={loading}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <>
      {localStorage.getItem('admin') ? (
        <div className="min-h-screen p-6 bg-gray-100 relative">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>

          {loading && !showAddForm && (
            <div className="text-center mb-4">Loading records...</div>
          )}

          {error && !showAddForm && (
            <div className="text-center text-red-500 mb-4">{error}</div>
          )}

          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
            >
              {showAddForm ? 'Close Form' : 'Add New Intern'}
            </button>
          </div>

          {showAddForm && <AddMemberForm />}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.length > 0 ? (
              records.map((record) => (
                <div
                  key={record._id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h4 className="text-xl font-semibold text-blue-700 mb-2">{record.Name}</h4>
                  <p><strong>Email:</strong> {record.email || 'N/A'}</p>
                  <p><strong>Mobile:</strong> {record.mobile || 'N/A'}</p>
                  <p><strong>College:</strong> {record.college || 'N/A'}</p>
                  <p><strong>ID:</strong> {record.id || 'N/A'}</p>
                  <div className="mt-2">
                    <strong>Attendance Records:</strong>
                    {record.dailyAttendance?.length > 0 ? (
                      <ul className="list-disc ml-5 text-sm">
                        {record.dailyAttendance.map((date, i) => (
                          <li key={i}>
                            {new Date(date).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No attendance records</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              !loading && <p className="text-center text-gray-600 col-span-full">No intern records available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-20 text-red-600 text-lg font-semibold">
          You are not authorized to view this page
        </div>
      )}
    </>
  );
}

export default Dashboard;