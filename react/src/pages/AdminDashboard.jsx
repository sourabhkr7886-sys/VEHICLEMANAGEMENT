import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalDrivers: 0,
    totalManagers: 0,
    vehiclesAddedByManagers: 0,
    driversAddedByManagers: 0,
    unassignedVehicles: 0,
    unassignedDrivers: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/dashboard/admin");
  
      setStats({
        totalVehicles: res.data.total_vehicles,
        totalDrivers: res.data.total_drivers,
        totalManagers: res.data.total_managers,
        vehiclesAddedByManagers: res.data.vehicles_added_by_admin,
        driversAddedByManagers: res.data.drivers_added_by_admin,
        unassignedVehicles: res.data.unassigned_vehicles,
        unassignedDrivers: res.data.unassigned_drivers,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="sidebar-title">
          Admin Panel
        </h2>

        <ul className="sidebar-menu">
          <li
            className="menu-item"
            onClick={() =>
              navigate("/admin-dashboard")
            }
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
              navigate("/add-manager")
            }
          >
            Add Manager
          </li>

          <li
            className="menu-item"
            onClick={() =>
              navigate("/ManagerDetails")
            }
          >
            Manager Details
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
            onClick={() =>
              navigate("/DriverManagement")
            }
          >
            Driver Management
          </li>

          <li
            className="menu-item"
            onClick={() =>
              navigate("/DriverDetails")
            }
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

      {/* MAIN */}
      <div className="main-content">
        <div className="navbar">
          <h2>Admin Dashboard</h2>

          <span className="welcome-badge">
            Welcome Admin
          </span>
        </div>

        <div className="content-area">
          {/* Cards */}
          <div className="cards-grid">

            <div className="dashboard-card">
              <h3>Total Vehicles</h3>
              <h1>{stats.totalVehicles}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Total Drivers</h3>
              <h1>{stats.totalDrivers}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Total Managers</h3>
              <h1>{stats.totalManagers}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Vehicles Added</h3>
              <h1>
                {stats.vehiclesAddedByManagers}
              </h1>
            </div>

            <div className="dashboard-card">
              <h3>Drivers Added</h3>
              <h1>
                {stats.driversAddedByManagers}
              </h1>
            </div>

            <div className="dashboard-card">
              <h3>Unassigned Vehicles</h3>
              <h1>
                {stats.unassignedVehicles}
              </h1>
            </div>

            <div className="dashboard-card">
              <h3>Unassigned Drivers</h3>
              <h1>
                {stats.unassignedDrivers}
              </h1>
            </div>

          </div>

          {/* Summary */}
          <div className="info-box">
            <h2>System Summary</h2>

            <table className="info-table">
              <tbody>

                <tr>
                  <td>Total Vehicles</td>
                  <td>{stats.totalVehicles}</td>
                </tr>

                <tr>
                  <td>Total Drivers</td>
                  <td>{stats.totalDrivers}</td>
                </tr>

                <tr>
                  <td>Total Managers</td>
                  <td>{stats.totalManagers}</td>
                </tr>

                <tr>
                  <td>Vehicles Added</td>
                  <td>
                    {stats.vehiclesAddedByManagers}
                  </td>
                </tr>

                <tr>
                  <td>Drivers Added</td>
                  <td>
                    {stats.driversAddedByManagers}
                  </td>
                </tr>

                <tr>
                  <td>Unassigned Vehicles</td>
                  <td>
                    {stats.unassignedVehicles}
                  </td>
                </tr>

                <tr>
                  <td>Unassigned Drivers</td>
                  <td>
                    {stats.unassignedDrivers}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;