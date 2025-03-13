import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles.css";

import App from "./App";
import HomePage from "./Home";
import Login from "./Login";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AddEmployee from "./AddEmployee";
import Register from "./Register";
import Profile from "./Profile";
import CreateTraining from "./CreateTraining";
import CreateQuiz from "./CreateQuiz";
import Messages from "./Messages";
import SendMessage from "./SendMessage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is the layout for the entire app
    children: [
      // HomePage and others are rendered inside <App />'s <Outlet />
      //to add a new page, follow the format below, and using <Link to="file_address">name_displayed</Link> to connect pages in needed file
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <Login /> },
      { path: "/manager", element: <ManagerDashboard /> },
      { path: "/employee", element: <EmployeeDashboard /> },
      { path: "/addEmployee", element: <AddEmployee /> },
      { path: "/register", element: <Register /> },
      { path: "/profile", element: <Profile /> },
      { path: "/createTraining", element: <CreateTraining /> },
      { path: "/createQuiz", element: <CreateQuiz /> },
      { path: "/messages", element: <Messages /> },
      { path: "/sendMessage", element: <SendMessage /> },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
