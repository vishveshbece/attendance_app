import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 🔧 Separated form component to avoid remounting issues
function AddMemberForm({
  name, setName,
  college, setCollege,
  id, setId,
  mobile, setMobile,
  email, setEmail,
  onClose, onSubmit
}) {
  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex justify-center items-start overflow-y-auto z-10 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-10">
        <h3 className="text-lg font-semibold mb-4">Add Intern</h3>

        {[{ label: 'Name', value: name, setValue: setName },
          { label: 'College Name', value: college, setValue: setCollege },
          { label: 'ID No.', value: id, setValue: setId },
          { label: 'Mobile No.', value: mobile, setValue: setMobile },
          { label: 'Email ID', value: email, setValue: setEmail }]
        .map((field, i) => (
          <div key={i} className="mb-3">
            <label className="block text-gray-700 font-semibold mb-1">{field.label}</label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onSubmit}
        >
          Add Intern
        </button>
        <button
          className="mt-3 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// 🔷 Main Component
function Dashboard() {
  const [records, setRecords] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const addIntern = async () => {
    try {
      const response = await axios.post(
        "https://attendance-app-gqu0.onrender.com/api/users",
        { Name: name, college: college, id: id, mobile: mobile, email: email }
      );
      if (response.status === 200) {
        alert("Intern data saved");
        setShowAddForm(false);
        setName('');
        setCollege('');
        setId('');
        setMobile('');
        setEmail('');
        fetchRecords(); // refresh records
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        "https://attendance-app-gqu0.onrender.com/api/users/get"
      );
      if (response.status === 200) {
        setRecords(response.data.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <>
      {localStorage.getItem('admin') ? (
        <div className="min-h-screen p-6 bg-gray-100 relative">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
            >
              {showAddForm ? 'Close Add Intern Form' : 'Add Intern Member'}
            </button>
          </div>

          {showAddForm && (
            <AddMemberForm
              name={name} setName={setName}
              college={college} setCollege={setCollege}
              id={id} setId={setId}
              mobile={mobile} setMobile={setMobile}
              email={email} setEmail={setEmail}
              onClose={() => setShowAddForm(false)}
              onSubmit={addIntern}
            />
          )}

          <div className="grid gap-4">
            {records.length > 0 ? (
              records.map((record, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h4 className="text-xl font-semibold text-blue-700 mb-2">{record.Name}</h4>
                  <p><strong>Email:</strong> {record.email || 'N/A'}</p>
                  <p><strong>Mobile:</strong> {record.mobile || 'N/A'}</p>
                  <p><strong>College:</strong> {record.college || 'N/A'}</p>
                  <p><strong>ID:</strong> {record.id || 'N/A'}</p>
                  <div className="mt-2">
                    <strong>Daily Attendance:</strong>
                    <ul className="list-disc ml-5 text-sm">
                      {Array.isArray(record.dailyAttendance) && record.dailyAttendance.length > 0 ? (
                        record.dailyAttendance.map((att, i) => (
                          <li key={i}>
                            {i + 1}. {att}
                          </li>
                        ))
                      ) : (
                        <li>No attendance available</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No intern records available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-20 text-red-600 text-lg font-semibold">
          You are not logged in as Admin
        </div>
      )}
    </>
  );
}

export default Dashboard;
