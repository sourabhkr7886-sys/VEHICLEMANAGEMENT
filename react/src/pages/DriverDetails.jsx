import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./DriverDetails.css";

function DriverDetails() {
  const [drivers, setDrivers] = useState([]);
  const [editingDriver, setEditingDriver] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/user/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDriver = async (id) => {
    if (!window.confirm("Delete this driver?")) return;

    try {
      await api.delete(`/user/${id}`);
      alert("Driver deleted successfully");
      fetchDrivers();
    } catch {
      alert("Delete failed");
    }
  };

  const updateDriver = async () => {
    try {
      await api.put(`/user/${editingDriver.id}`, editingDriver);

      alert("Driver updated successfully");
      setEditingDriver(null);
      fetchDrivers();
    } catch {
      alert("Update failed");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.put(`/user/status/${id}`);
      fetchDrivers();
    } catch {
      alert("Unable to change status");
    }
  };

  const filteredDrivers = drivers.filter((driver) =>
    (
      driver.first_name +
      " " +
      driver.last_name +
      " " +
      driver.email +
      " " +
      driver.username
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="driver-details-container">

      <h2 className="driver-details-title">
        Driver Management
      </h2>

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search Driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="driver-details-table-wrapper">
        <table className="driver-details-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Profile</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Vehicle</th>
              <th>DOB</th>
              <th>License</th>
              <th>Expiry</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredDrivers.length > 0 ? (

              filteredDrivers.map((driver) => (

                <tr key={driver.id}>

                  <td>{driver.id}</td>

                  <td>
                    {driver.profile_image ? (
                      <img
                        className="driver-details-img"
                        src={`http://127.0.0.1:8000/${driver.profile_image}`}
                        alt=""
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>{driver.first_name}</td>

                  <td>{driver.last_name}</td>

                  <td>{driver.email}</td>

                  <td>
                    {driver.vehicle_name || (
                      <span className="not-assigned">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  <td>{driver.dob}</td>

                  <td>
                    {driver.driving_license ? (
                      <a
                        href={`http://127.0.0.1:8000/${driver.driving_license}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      "No License"
                    )}
                  </td>

                  <td>{driver.license_expiry_date}</td>

                  <td>{driver.experience_years} Years</td>

                  <td>
                    {driver.active ? (
                      <span className="active-status">
                        Active
                      </span>
                    ) : (
                      <span className="inactive-status">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="driver-details-actions">

                    <button
                      className="edit-btn"
                      onClick={() => setEditingDriver(driver)}
                    >
                      Edit
                    </button>

                    <button
                      className={
                        driver.active
                          ? "deactivate-btn"
                          : "activate-btn"
                      }
                      onClick={() => toggleStatus(driver.id)}
                    >
                      {driver.active
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteDriver(driver.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td
                  colSpan="12"
                  className="driver-details-no-data"
                >
                  No Drivers Found
                </td>
              </tr>

            )}

          </tbody>

        </table>
      </div>

      {editingDriver && (

        <div className="driver-details-overlay">

          <div className="driver-details-modal">

            <h3>Edit Driver</h3>

            <input
              value={editingDriver.first_name || ""}
              onChange={(e) =>
                setEditingDriver({
                  ...editingDriver,
                  first_name: e.target.value,
                })
              }
              placeholder="First Name"
            />

            <input
              value={editingDriver.last_name || ""}
              onChange={(e) =>
                setEditingDriver({
                  ...editingDriver,
                  last_name: e.target.value,
                })
              }
              placeholder="Last Name"
            />

            <input
              value={editingDriver.email || ""}
              onChange={(e) =>
                setEditingDriver({
                  ...editingDriver,
                  email: e.target.value,
                })
              }
              placeholder="Email"
            />

            <input
              type="date"
              value={editingDriver.dob || ""}
              onChange={(e) =>
                setEditingDriver({
                  ...editingDriver,
                  dob: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Address"
              value={editingDriver.driver_address || ""}
              onChange={(e) =>
                setEditingDriver({
                  ...editingDriver,
                  driver_address: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Experience"
              value={editingDriver.experience_years || ""}
              onChange={(e) =>
                setEditingDriver({
                  ...editingDriver,
                  experience_years: e.target.value,
                })
              }
            />

            <div className="driver-details-buttons">

              <button
                className="save-btn"
                onClick={updateDriver}
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditingDriver(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default DriverDetails;