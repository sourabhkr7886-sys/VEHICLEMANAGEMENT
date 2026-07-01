import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ManagerDashboard.css";

function ManagerDashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    total_vehicles: 0,
    total_drivers: 0,
    vehicles_added_by_manager: 0,
    drivers_added_by_manager: 0,
    unassigned_vehicles: 0,
    unassigned_drivers: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/dashboard/manager", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      
    
      <div className="sidebar">
        <h2 className="sidebar-title">
          Manager Panel
        </h2>

        <ul className="sidebar-menu">
          <li
            className="menu-item"
            onClick={() => navigate("/manager-dashboard")}
          >
            Dashboard
          </li>

          <li
            className="menu-item"
            onClick={() => navigate("/vehicles")}
          >
            Vehicles
          </li>
          <li
            className="menu-item"
            onClick={() =>
              navigate("/add-driver")
            }
          >
            Add Driver
          </li>

          <li
            className="menu-item"
            onClick={() => navigate("/DriverManagement")}
          >
            Driver Management
          </li>

          <li
            className="menu-item"
            onClick={() => navigate("/DriverDetails")}
          >
            Driver Details
          </li>

          <li
            className="menu-item"
            onClick={() => navigate("/profile")}
          >
            Profile
          </li>
        </ul>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

     
      <div className="main-content">

        <div className="navbar">
          <h2>Manager Dashboard</h2>

          <span className="welcome-badge">
            Welcome {role === "manager" ? "Manager" : "User"}
          </span>
        </div>

        <div className="content-area">

          
          <div className="cards-grid">

            <div className="dashboard-card">
              <h3>Total Vehicles</h3>
              <h1>{stats.total_vehicles}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Total Drivers</h3>
              <h1>{stats.total_drivers}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Vehicles Added By Me</h3>
              <h1>{stats.vehicles_added_by_manager}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Drivers Added By Me</h3>
              <h1>{stats.drivers_added_by_manager}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Unassigned Vehicles</h3>
              <h1>{stats.unassigned_vehicles}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Unassigned Drivers</h3>
              <h1>{stats.unassigned_drivers}</h1>
            </div>

          </div>

          <div className="info-box">
            <h2>Manager Summary</h2>

            <table className="info-table">
              <tbody>

                <tr>
                  <td>Total Vehicles</td>
                  <td>{stats.total_vehicles}</td>
                </tr>

                <tr>
                  <td>Total Drivers</td>
                  <td>{stats.total_drivers}</td>
                </tr>

                <tr>
                  <td>Vehicles Added By Me</td>
                  <td>{stats.vehicles_added_by_manager}</td>
                </tr>

                <tr>
                  <td>Drivers Added By Me</td>
                  <td>{stats.drivers_added_by_manager}</td>
                </tr>

                <tr>
                  <td>Unassigned Vehicles</td>
                  <td>{stats.unassigned_vehicles}</td>
                </tr>

                <tr>
                  <td>Unassigned Drivers</td>
                  <td>{stats.unassigned_drivers}</td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;