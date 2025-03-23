import React,{useState} from 'react';
function UserLogin({onuser}){
    const [user,setuser] = useState('');
    const [password,setpassword] = useState('');
    return(
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 relative">
            <h2 className="text-2xl font-bold mb-4">User</h2>
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setuser(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                        onClick={() => onuser(user,password)}
                    >
                        User Login
                    </button>
                </div>
        </div>
    )
}
export default UserLogin;