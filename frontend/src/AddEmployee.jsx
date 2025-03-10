import React, { useState } from "react";

export default function AddEmployee() {
    const [formData, setFormData] = useState({ first_name: "", last_name: "", role: "employee" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/addToRoster", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Request failed: " + error.message);
        }
    };

    return (
        <div>
            <h2>Manager: Add Employee</h2>
            <form onSubmit={handleSubmit}>
                <input name="first_name" placeholder="First Name" onChange={handleChange} required />
                <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
                <select name="role" onChange={handleChange} value="employee" disabled>
                    <option value="employee">Employee</option>
                </select>
                <button type="submit">Add Employee</button>
            </form>
            <p>{message}</p>
        </div>
    );
}