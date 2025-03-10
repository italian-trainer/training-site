import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // To show errors or success messages
  const navigate = useNavigate(); // Used to redirect after login

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5005/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Connection": "keep-alive"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Data:", data);
      console.log("Email:", email);
      console.log("Password:", password);

      if (response.ok) {
        setMessage("Login successful!");
        // cookies.set("SessionID", data.body.SessionID.token, data.body.SessionID.options);
        console.log("Role:", data.body.role);
        // Redirect user based on role
        if (data.body.role === "manager" || data.body.role === "admin") {
          navigate("/manager");
        } else if (data.body.role === "employee") {
          navigate("/employee");
        }
      } else {
        setMessage("Error");
      }
    } 
    catch (error) {
      setMessage("Request failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>
        <button type="submit">Login</button>
      </form>

      <p>{message}</p> 

      <Link to="/">Go Back</Link>
      <br />
      <Link to="/manager">Temp Manager Link</Link>
      <br />
      <Link to="/employee">Temp Employee Link</Link>

    </div>
  );
};

export default Login;
