import React from 'react';
import './sidebar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
export const Sidebar = () => {
  return (
    <div className='sidebar'>
         <div className='top'>
            <span className='title'>Log Visualizer</span>
         </div>
         <hr/>
         <div className='center'>
         <ul>
            <li><HomeIcon className='icon'/>Home</li>
            <li><DashboardIcon className='icon'/>Dashboard</li>
         </ul>
    </div>
    </div>
  )
}
