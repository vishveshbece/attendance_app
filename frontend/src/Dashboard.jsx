import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    Name: '',
    college: '',
    id: '',
    mobile: '',
    email: ''
  });

  // Fetch all users with attendance
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const addUser = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate required fields
      if (!Object.values(formData).every(field => field.trim())) {
        throw new Error('All fields are required');
      }

      const response = await axios.post('/api/users', formData);
      if (response.status === 201) {
        await fetchUsers(); // Refresh list
        setFormData({
          Name: '',
          college: '',
          id: '',
          mobile: '',
          email: ''
        });
      }
    } catch (err) {
      console.error('Add error:', err);
      setError(err.response?.data?.message || err.message || 'Error adding user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Attendance Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* User List Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : users.length > 0 ? (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user._id} className="border-b pb-3">
                  <h3 className="font-medium">{user.Name}</h3>
                  <p>ID: {user.id}</p>
                  <p>College: {user.college}</p>
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">Attendance:</h4>
                    {user.dailyAttendance?.length > 0 ? (
                      <ul className="text-sm">
                        {user.dailyAttendance.map((date, i) => (
                          <li key={i}>{new Date(date).toLocaleDateString()}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No attendance yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No users found</p>
          )}
        </div>

        {/* Add User Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">College</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">ID Number</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              onClick={addUser}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;