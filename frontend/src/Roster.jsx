import React, { useState, useEffect } from "react";
import "./Roster.css";

const Roster = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://localhost:5005/roster/get_all_users", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch employee data");
                }

                const data = await response.json();

                //Don't put users who's user_id is the same as email in the table
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

    return (
        <div className="roster-container">
            <h2>Employee Roster</h2>

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
        </div>
    );
};

export default Roster;