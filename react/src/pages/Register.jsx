import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "driver",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/register", form);

      localStorage.setItem("token", res.data.access_token);

      setMessage("Registration Successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">

        
        <button
          className="close-btn"
          onClick={() => navigate("/")}
        >
          ✕
        </button>

        <h2 className="register-title">REGISTER ACCOUNT</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <select
            className="register-input"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="driver">Driver</option>
          </select>

          <input
            className="register-input"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="register-btn" type="submit">
            Register
          </button>
        </form>

        {message && (
          <p className="register-message">{message}</p>
        )}

      </div>
    </div>
  );
}

export default Register;