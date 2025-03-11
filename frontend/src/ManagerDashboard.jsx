import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  // State for toggling the account dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [employees, setEmployees] = useState([]); // Store employees
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Employee Roster
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5005/roster/get_all_users", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) throw new Error("Failed to fetch employee data");

        const data = await response.json();
        
        // Filter out users where user_id === email
        const filteredEmployees = data.data.filter(
          (employee) => employee.user_id !== employee.email
        );

        setEmployees(filteredEmployees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);


  // Sample data for assigned trainings
  const assignedTrainings = [
    {
      id: 1,
      title: "Training 1: Modules",
      assignedTo: ["885092", "127362"]
    },
    {
      id: 2,
      title: "Training 2: Quiz",
      assignedTo: ["189273", "871287", "192873"]
    },
    {
      id: 3,
      title: "Training 3: Modules",
      assignedTo: ["238434", "123439", "734623", "348573"]
    }
  ];

  // Toggle the dropdown menu
  const handleAccountClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="manager-dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="brand">
          <h1>Maria's Italian</h1>
        </div>
        <div className="account-section">
          <button className="account-button" onClick={handleAccountClick}>
            Account
          </button>
          {showDropdown && (
            <div className="account-dropdown">
              <ul>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/messages">Messages</Link>
                </li>
                <li>
                  <Link to="/login">Log Out</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <h2>Manager Dashboard</h2>

        {/* SEARCH BAR */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search trainings..."
            aria-label="Search Trainings"
          />
        </div>

        {/* ASSIGNED TRAININGS SECTION */}
        <section className="assigned-trainings">
          <h3>Assigned Trainings</h3>
          <div className="training-list">
            {assignedTrainings.map((training) => (
              <div key={training.id} className="training-card">
                <h4>{training.title}</h4>
                <p>
                  <strong>Assigned To:</strong>{" "}
                  {training.assignedTo.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* EMPLOYEE ROSTER (Embedded) */}
        <section className="employee-roster">
          <h3>Employee Roster</h3>
          {loading ? (
            <p>Loading employees...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <table className="roster-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Employee ID</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.user_id}>
                    <td>{employee.first_name}</td>
                    <td>{employee.last_name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.user_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ACTION BUTTONS */}
        <div className="actions">
          <Link to="/addEmployee">
            <button className="addEmployee">+ Add Employee</button>
          </Link>
          <button className="create-training-btn">+ Create Training</button>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;