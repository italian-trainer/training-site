import React from 'react';
import './Home.css'; 
import Logo from '../src/mikLogo.png'
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to Maria's Italian Kitchen Training Course</h1>
      <div className="logo-container">
        <img 
          src={Logo} // Use the imported Logo here
          alt="Maria's Italian Restaurant Logo"
          className="logo" 
        />
      </div>

      <br/>
      <Link to="/login">
        <button className="login-button">Login</button>
      </Link>
    </div>
  );
};

export default HomePage;