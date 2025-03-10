import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AddEmployee() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [message, setMessage] = useState(""); 


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure inputs are not empty
        if (!first_name.trim() || !last_name.trim()) {
            setMessage("Error: First and last name cannot be empty.");
            return;
        }

        const role = "employee";

        try {
            const response = await fetch("http://localhost:5005/roster/add_user", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Connection": "keep-alive"
              },
              body: JSON.stringify({ first_name, last_name, role })
            });

            console.log(localStorage.getItem("token"));
            const data = await response.json();
            if (response.ok) {
                setMessage(`User ${data.data.user_id} added successfully!`);
                setFirstName("");
                setLastName("");
            } else {
                setMessage(`Error: ${data.message || "Unable to add user"}`);
            }
        } catch (error) {
            setMessage("Request failed: " + error.message);
        }
    };

    return (
        <div>
            <h2>Manager: Add Employee</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input 
                        type="text" 
                        placeholder="First Name" 
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                    />
                </div>
                {/* Role is hardcoded to "employee" */}
                <p><strong>Role:</strong> Employee</p> 

                <button type="submit">Add Employee</button>
            </form>
            <p>{message}</p>
        </div>
    );
}