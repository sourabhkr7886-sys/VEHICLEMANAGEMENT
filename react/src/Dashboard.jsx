import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      const res = await api.get("/dashboard/driver");
      setDriver(res.data);
    } catch (error) {
      console.error("Error loading driver data", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
     
      <div className="sidebar">
        <h2 className="sidebar-title">Driver Panel</h2>

        <ul className="sidebar-menu">
          <li
            className="menu-item"
            onClick={() => navigate("/Dashboard")}
          >
            Dashboard
          </li>

          <li
            className="menu-item"
            onClick={() => navigate("/DriverProfile")}
          >
            Edit Profile
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
          <h2>Driver Dashboard</h2>

          <span className="welcome-badge">
            Welcome {driver?.first_name || "Driver"}
          </span>
        </div>

        <div className="content-area">
   
          <div className="cards-grid">
            <div className="dashboard-card">
              <h3>Driver ID</h3>
              <h1>{driver?.id || "-"}</h1>
            </div>

            <div className="dashboard-card">
              <h3>Assigned Vehicle</h3>
              <h1>
                {driver?.assigned_vehicle_name ? "1" : "0"}
              </h1>
            </div>

            <div className="dashboard-card">
              <h3>Status</h3>
              <h1>
                {driver?.assigned_vehicle_name
                  ? "Assigned"
                  : "No Vehicle"}
              </h1>
            </div>
          </div>

        
          <div className="info-box">
            <h2>Driver Information</h2>

            <table className="info-table">
              <tbody>
                <tr>
                  <td>Username</td>
                  <td>{driver?.username || "N/A"}</td>
                </tr>

                <tr>
                  <td>First Name</td>
                  <td>{driver?.first_name || "N/A"}</td>
                </tr>

                <tr>
                  <td>Last Name</td>
                  <td>{driver?.last_name || "N/A"}</td>
                </tr>

                <tr>
                  <td>Email</td>
                  <td>{driver?.email || "N/A"}</td>
                </tr>

                <tr>
                  <td>DOB</td>
                  <td>{driver?.dob || "N/A"}</td>
                </tr>

                <tr>
                  <td>License Expiry</td>
                  <td>{driver?.license_expiry_date || "N/A"}</td>
                </tr>

                <tr>
                  <td>Address</td>
                  <td>{driver?.driver_address || "N/A"}</td>
                </tr>

                <tr>
                  <td>Experience</td>
                  <td>
                    {driver?.experience_years || 0} Years
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          
          <div className="info-box">
            <h2>Assigned Vehicle Details</h2>

            <table className="info-table">
              <tbody>
                <tr>
                  <td>Vehicle Name</td>
                  <td>{driver?.vehicle_name || "N/A"}</td>
                </tr>

                <tr>
                  <td>Registration Number</td>
                  <td>
                    {driver?.registration_number || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td>Assigned Vehicle</td>
                  <td>
                    {driver?.assigned_vehicle_name ||
                      "No Vehicle Assigned"}
                  </td>
                </tr>

                <tr>
                  <td>Status</td>
                  <td>
                    {driver?.assigned_vehicle_name
                      ? "Assigned"
                      : "Not Assigned"}
                  </td>
                </tr>

                <tr>
                  <td>Profile Status</td>
                  <td>
                    {driver?.active
                      ? "Active"
                      : "Inactive"}
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

export default Dashboard;