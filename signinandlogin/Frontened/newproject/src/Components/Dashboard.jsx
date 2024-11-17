import React, { useState } from 'react'
import "../Components/Dashboard.css"
import User from './User';
import Hero from './Hero';
import Client from './Client';
import Employee from './Employee';
import Product from './product';

function Dashboard() {
  const[currentView ,setCurrentView]=useState("Home");
  const handlemenuclick=(view)=>{
    setCurrentView(view);
  };
  const rendercontent=()=>{
    switch(currentView){
      
      case "Setting":
      return<div>Setting Content</div>;
      case "Users":
        return<div><User/></div>;
        case "Hero":
        return<div><Hero/></div>;
        case "Client":
        return<div><Client/></div>;
        case "Employee":
          return<div><Employee/></div>;
          case "Product":
            return<div><Product/></div>;
           
      default:
      return <div>Welcome to  Dashboard</div>
    }
  }
  return (
    <div className='dashboard-container'>
      {/* sidebar */}
      <div className='sidebar'>
        <h3>Sidebar Menu</h3>
        <ul>
        <li onClick={()=>handlemenuclick("Hero")}>Dashboard</li>
        <li onClick={()=>handlemenuclick("Users")}>Users</li>
        <li onClick={()=>handlemenuclick("Client")}>Client</li>
        <li onClick={()=>handlemenuclick("Employee")}>Employee</li>
        <li onClick={()=>handlemenuclick("Product")}>Product</li>

          <li onClick={()=>handlemenuclick("Setting")}>Setting</li>
        </ul>

      </div>
     {/* main dashboard */}
     <div className='main-content'>
      {/* header */}
      <header className='header'>
        <div className='profile-section'>
          <img src="https://via.placeholder.com/40" alt="profile"className='profile-picture' />
          <span className='profile-name'>John Doe</span>
        </div>
        <h2 className='view-title'>Dashboard</h2>
      </header>
      <main className='content'>
        {rendercontent()}

      </main>
     </div>
    </div>
  )
}

export default Dashboard
