import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles.css";

import App from "./App";
import HomePage from './Home';
import Login from "./Login";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

//employee training modules
import TrainingLayout from "./pages/training/Layout";
import Module1Server from "./pages/training/server/Module1";
import Module1Cashier from "./pages/training/cashier/Module1";

const router = createBrowserRouter([
{
  path: "/",
  element: <App />, // App is the layout for the entire app
  children: [ // HomePage and others are rendered inside <App />'s <Outlet />
    //to add a new page, follow the format below, and using <Link to="file_address">name_displayed</Link> to connect pages in needed file
    { path: "/", element: <HomePage />},
    { path: "/login", element: <Login />}, 
    { path: "/manager", element: <ManagerDashboard /> },
    { path: "/employee", element: <EmployeeDashboard /> },
    
    // Training Routes
    { path: "/training/:role", element: <TrainingLayout /> },
    { path: "/training/server/module1", element: <Module1Server /> },
    { path: "/training/cashier/module1", element: <Module1Cashier /> },
  ],
},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router = {router} />
  </React.StrictMode>,
);
