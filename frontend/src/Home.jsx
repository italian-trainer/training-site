import React from 'react';
import './Home.css'; 
import Logo from '../src/homeLogo.png'

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Maria's Italian Restaurant</h1>
      <div className="logo-container">
        <img 
          src={Logo} // Use the imported Logo here
          alt="Maria's Italian Restaurant Logo"
          className="logo" 
        />
      </div>
      <br/>
      <button className="login-button">Login</button>
    </div>
  );
};

export default HomePage;