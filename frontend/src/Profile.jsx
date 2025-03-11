import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    
    const [employee, setEmployee] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      employeeID: "",
    });

    const [message, setMessage] = useState("");

    const fetchUserInfo = async () => {
        try {
            const response = await fetch("http://localhost:5005/auth/get_info", {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token") 
                }
            });

            const data = await response.json();
            console.log("User Info:", data);

            if (response.ok) {
                setEmployee({
                    firstName: data.data.first_name,
                    lastName: data.data.last_name,
                    email: data.data.email,
                    employeeID: data.data.user_id,
                    role: data.data.role,
                    displayedPassword: "********" //for security
                });
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);
  
    const handleEdit = async (field) => {
        const newValue = prompt('Edit ${field}:', employee[field]);
        if (newValue === null || newValue.trim() === "") return; //prevent empty values

        //password requirements
        if (field === "password") {
            const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
            if (!passwordRegex.test(newValue)) {
                alert("Error: Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 number.");
                return;
            }
        }

        //request to backend (body)
        const updatedData = {
        email: employee.email,
        user_id: employee.employeeID,
        first_name: employee.firstName, 
        last_name: employee.lastName, 
        };

        //only update field that got changed
        if (field === "firstName") updatedData.first_name = newValue;
        if (field === "lastName") updatedData.last_name = newValue;
        if (field === "email") updatedData.email = newValue;
        if (field === "password" && newValue !== "********"){
            updatedData.password = newValue;
        }

        console.log("Sending update request:", updatedData);

        try {
            const response = await fetch("http://localhost:5005/auth/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Connection": "keep-alive"
                },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();
            console.log("Full API Response:", data);

            if (response.ok) {
                setEmployee({ 
                    ...employee, 
                    [field]: field === "password" ? "********" : newValue,
                    password: field === "password" ? newValue : employee.password
                });
                alert("Profile updated successfully!");
            } else {
                alert('Error: Unable to update profile');
            }
        } catch (error) {
            alert("Request failed: " + error.message);
        }
    };
  
    return (
      <div className="profile-container">
  
        {/* Manager */}
        <div className="manager-info">
          <h2>{employee.firstName} {employee.lastName}</h2>
          <h3>Active {employee.role}</h3>
          <p>{employee.employeeID}</p>
        </div>
  
        {/* Personal Info */}
        <div className="personal-info">
          <h4>Personal Info:</h4>
          <div className="info-item">
            <span>First Name: </span>
            <span>{employee.firstName}</span>
            <button onClick={() => handleEdit("firstName")}>✏️</button>
          </div>
          <div className="info-item">
            <span>Last Name: </span>
            <span>{employee.lastName}</span>
            <button onClick={() => handleEdit("lastName")}>✏️</button>
          </div>
          <div className="info-item">
            <span>Email: </span>
            <span>{employee.email}</span>
            <button onClick={() => handleEdit("email")}>✏️</button>
          </div>
          <div className="info-item">
            <span>Password: </span>
            <span>{employee.displayedPassword}</span>
            <button onClick={() => handleEdit("password")}>✏️</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Profile;