import React,{useState} from 'react';
import Dashboard from './Dashboard';
import QRCodePage from './QRCodePage';
function AdminDashboard() {
    const [dash,setdash] = useState(true);
    return (
        <div>
            {localStorage.getItem('admin')?(<div className='flex gap-4 items-end justify-end bg-blue-400'>
                <div className='p-4' onClick={()=>setdash(true)}>Dashboard</div>
                <div className='p-4' onClick={()=>setdash(false)}>QRCode</div>
            </div>
            ):(<div></div>)}
            {dash &&(<Dashboard/>)}
            {!dash &&(<QRCodePage/>)}
            </div>
            );
}

export default AdminDashboard;
