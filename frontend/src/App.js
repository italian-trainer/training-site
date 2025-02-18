import React from 'react';
import { Outlet, Link } from "react-router-dom"; // Outlet renders the child routes

const App = () => {
  return (
    <div>
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

export default App;