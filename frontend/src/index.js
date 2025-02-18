import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles.css";

import App from "./App";
import HomePage from './Home';
import Login from "./Login";
import ManagerDashboard from "./ManagerDashboard";

const router = createBrowserRouter([
{
  path: "/",
  element: <App />, // App is the layout for the entire app
  children: [ // HomePage and others are rendered inside <App />'s <Outlet />
    //to add a new page, follow the format below, and using <Link to="file_address">name_displayed</Link> to connect pages in needed file
    { path: "/", element: <HomePage />},
    { path: "/login", element: <Login />}, 
    { path: "/manager", element: <ManagerDashboard /> },
  ],
},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router = {router} />
  </React.StrictMode>,
);
