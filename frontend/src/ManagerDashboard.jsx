import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ManagerDashboard.css";
import "./Roster.css";

const ManagerDashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [employees, setEmployees] = useState([]); //employees
  const [trainings, setTrainings] = useState([]); //trainings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  //Employee Roster
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
        
        //filter out users where user_id === email
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


  //fetch trainings
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch("http://localhost:5005/trainings/list_trainings", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) throw new Error("Failed to fetch trainings");

        const data = await response.json();
        console.log("Data:", data.data);
        
        setTrainings(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  // Toggle the dropdown menu
  const handleAccountClick = () => {
    setShowDropdown(!showDropdown);
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.first_name} ${employee.last_name} ${employee.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const searchLower = searchQuery.toLowerCase();
    const aMatch = a.first_name.toLowerCase() === searchLower || 
                   a.last_name.toLowerCase() === searchLower || 
                   a.email.toLowerCase() === searchLower;
    const bMatch = b.first_name.toLowerCase() === searchLower || 
                   b.last_name.toLowerCase() === searchLower || 
                   b.email.toLowerCase() === searchLower;
  
    return bMatch - aMatch; //exact matches to top
  });

  const filteredTrainings = trainings.filter((training) =>
    `${training.title} ${training.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );


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

      {/* Content */}
      <main className="dashboard-main">
        <h2>Manager Dashboard</h2>

        {/* Search */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search employees or trainings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Trainings and Employees"
          />
        </div>

        {/* Assigned Trainings */}
        <section className="assigned-trainings">
          <h3>Assigned Trainings</h3>
          {loading ? (
            <p>Loading trainings...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredTrainings.length > 0 ? (
          <div className="training-list">
            {filteredTrainings.map((training) => (
              <div key={training.id} className="training-card">
                <h4 className="training-title">{training.title}</h4>
                <p className="assigned-users">
                  <strong>Assigned Users:</strong> {training.assigned_users.map(user => user.display_name).join(", ")}
                </p>
                <p className="training-description">
                  <strong>Description:</strong> {training.description || "No description provided"}
                </p>
              </div>
            ))}
          </div>
          ) : (
            <p>No trainings match your search.</p>
          )}
        </section>


        {/* Employee Roster */}
        <section className="employee-roster">
          <h3>Employee Roster</h3>
          {loading ? (
            <p>Loading employees...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : sortedEmployees.length > 0 ? (
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
                {sortedEmployees.map((employee) => (
                  <tr key={employee.user_id}>
                    <td>{employee.first_name}</td>
                    <td>{employee.last_name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.user_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No employees match your search.</p>
          )}
        </section>

        {/* Buttons */}
        <div className="actions">
          <Link to="/addEmployee">
            <button className="addEmployee">+ Add Employee</button>
          </Link>
          <Link to="/createTraining">
            <button className="create-training-btn">+ Create Training</button>
          </Link>
          <Link to="/createQuiz">
            <button className="create-quiz-btn">+ Create Quiz</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;