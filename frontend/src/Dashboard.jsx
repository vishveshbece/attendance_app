import React, { useState,useEffect } from 'react';
import axios from 'axios';
function Dashboard() {
    const [records,setrecords] = useState([]);
    const [name, setname] = useState('');
    const [id, setid] = useState('');
    const [mobile,setmobile]= useState('');
    const [email,setemail] = useState('');
    const [college, setcollege] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const addintern = async () =>{
      try {
        const response = await axios.post("http://localhost:7000/api/users", { Name: name, college: college, id:id,mobile:mobile,email:email });
        if (response.status === 200) {
            alert("intern data saved");
            setShowAddForm(false);
        } else {
            console.log("error");
        }
    } catch (err) {
        console.log(err);
    }}
    const addmembers = () => {
        return (
            <div className="absolute top-4 left-0 w-full h-full bg-opacity-50 grid justify-center items-center z-10 bg-grey-200">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            College Name
                        </label>
                        <input
                            type="text"
                            value={college}
                            onChange={(e) => setcollege(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Id no.
                        </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setid(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Mobile no.
                        </label>
                        <input
                            type="text"
                            value={mobile}
                            onChange={(e) => setmobile(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Mail Id
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
                        onClick={() => {addintern()}}
                    >
                        Add Intern
                    </button>
                    <button
                        type="button"
                        className="mt-4 w-full py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                        onClick={() => setShowAddForm(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };
    const recorder = async()=>{
      try{
        const response = await axios.get("http://localhost:7000/api/users/get");
        if(response.status === 200){
          return response.data.users;
        }
      }
      catch(err){
        console.log(err);
      }
    }
    useEffect(() => {
      const fetchData = async () => {
          const data = await recorder();
          if (data) {
              setrecords(data);
          }
      };
      fetchData();
  }, []);
    return (
        <>{localStorage.getItem('admin')? (<div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 relative">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                    <h3 className="text-xl font-semibold mb-4">Attendance Records</h3>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className='p-4 bg-green-300'>
                        {showAddForm ? 'Close Add Intern Form' : 'Add Intern Members'}
                    </button>
                    {showAddForm && addmembers()} {}
                    <ul className="list-disc list-inside">
                    {Array.isArray(records) && records.length > 0 ? (
                    records.map((record, index) => (
                    <li key={index} className="mb-4">
                      <div><strong>Name:</strong> {record.Name}</div>
                      <div><strong>Email:</strong> {record.email}</div>
                      <div><strong>Mobile:</strong> {record.mobile}</div>
                      <div><strong>College:</strong> {record.college}</div>
                      <div><strong>ID:</strong> {record.id}</div>
                      <div>
                      <strong>Daily Codes:</strong> 
                      {Array.isArray(record['dailyAttendance']) && record['dailyAttendance'].length > 0 ? (record['dailyAttendance'].map((att,index)=>(
                        <li key={index} className='mb-4'>
                            <div><strong>{index+1}:</strong>{att}</div>
                        </li>
                        ))):(
                            <p>No attendance available</p>
                        )}
                        </div>
                     </li>
                      ))
                      ) : (
                      <p>No records available.</p>
                      )}
                    </ul>
            </div>
        ):(<p>you didn't login yet</p>)}
            </>
            );
}

export default Dashboard;
