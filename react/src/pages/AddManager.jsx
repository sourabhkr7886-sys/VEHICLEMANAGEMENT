import React, { useState } from "react";
import api from "../services/api";
import "./AddManager.css";

function AddManager() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/user/add-manager",
        form
      );

      alert(
        `Manager Created Successfully\nID: ${res.data.manager_id}`
      );

      setForm({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.detail ||
        "Failed to create manager"
      );
    }
  };

  return (
    <div className="add-manager-container">
      <div className="add-manager-card">

        <h2 className="add-manager-title">
          Add Manager
        </h2>

        <form
          className="manager-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <div className="form-row">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="button-group">
            <button
              type="submit"
              className="submit-btn"
            >
              Create Manager
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                setForm({
                  username: "",
                  first_name: "",
                  last_name: "",
                  email: "",
                  password: "",
                })
              }
            >
              Clear
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddManager;