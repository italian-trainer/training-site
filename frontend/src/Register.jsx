import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
    const [user_id, setUserID] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [message, setMessage] = useState(""); 


    const handleSubmit = async (e) => {
        e.preventDefault();

        //make sure nothing empty 
        if (!user_id.trim() || !email.trim() || !first_name.trim() || !last_name.trim()) {
            setMessage("Error: User ID, Email, First Name, or Last Name cannot be empty.");
            return;
        }
        //check password
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Error: Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 number.");
            return;
        }


        try {
            const response = await fetch("http://localhost:5005/auth/register", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Connection": "keep-alive"
              },
              body: JSON.stringify({ email, user_id, first_name, last_name, password })
            });

            //console.log(localStorage.getItem("token"));
            const data = await response.json();
            if (response.ok) {
                setMessage("Registered Successfully");
                setFirstName("");
                setLastName("");
                setPassword("");
                setEmail("");
                setUserID("");
            } else {
                setMessage('Error: Unable to register user');
            }
        } catch (error) {
            setMessage("Request failed: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Register:</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>User ID:</label>
                    <input 
                        type="text" 
                        placeholder="User ID" 
                        value={user_id}
                        onChange={(e) => setUserID(e.target.value)}
                        required 
                    />
                </div>
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
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>

                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
}