import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notification";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      notifyError("Fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        notifyError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      notifySuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      notifyError("Server error");
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>{isLoading ? "Registering..." : "Register"}</button>
      
        <Link to="/" className="back-btn">
        ← Back to Home
       </Link>
      </form>
    </div>
  );
}

export default Register;