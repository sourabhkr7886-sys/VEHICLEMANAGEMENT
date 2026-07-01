import React, { useState } from "react";
import api from "../services/api";
import "./AddManager.css";

function AddDriver() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/user/add-driver", form);

      alert("Driver Created Successfully\nID: " + res.data.driver_id);

      setForm({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create driver");
    }
  };

//  CLEAR FORM
  const handleClear = () => {
    setForm({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="add-manager-container">
      <div className="add-manager-card">

        <h2 className="add-manager-title">Add Driver</h2>

        <form className="manager-form" onSubmit={handleSubmit}>

          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />

          <div className="form-row">
            <input
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
            />

            <input
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

    
          <div className="button-group">
            <button type="submit" className="submit-btn">
              Create Driver
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddDriver;