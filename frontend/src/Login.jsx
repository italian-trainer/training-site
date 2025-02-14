import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to="/">Go Back</Link>
    </div>
  );
};

export default Login;
