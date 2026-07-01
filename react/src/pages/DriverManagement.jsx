import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./DriverManagement.css";

function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/user/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDriver = async (id) => {
    if (!window.confirm("Delete this driver?")) return;

    try {
      await api.delete(`/user/${id}`);
      alert("Driver deleted successfully");
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete driver");
    }
  };

  const updateDriver = async () => {
    try {
      await api.put(`/user/${editingDriver.id}`, {
        username: editingDriver.username,
        email: editingDriver.email,
      });

      alert("Driver updated successfully");
      setEditingDriver(null);
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Failed to update driver");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.put(`/user/status/${id}`);
      alert("Driver status updated successfully");
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const assignVehicle = async (driverId, vehicleId) => {
    if (!vehicleId) return;

    try {
      await api.post("/assign-vehicle", {
        driver_id: driverId,
        vehicle_id: parseInt(vehicleId),
      });

      alert("Vehicle assigned successfully");
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Failed to assign vehicle");
    }
  };

  const filteredDrivers = drivers.filter((driver) =>
    (
      driver.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="page-container">

      <h1 className="table-title">Driver Management</h1>

      <div className="table-container">

        <div className="search-container">
          <input
            type="text"
            placeholder="Search Driver..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

       
        <div className="table-wrapper">
          <table className="vehicle-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Vehicle Name</th>
                <th>Status</th>
                <th>Assign Vehicle</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id}>

                    <td>{driver.id}</td>
                    <td>{driver.username}</td>
                    <td>{driver.email}</td>

                    <td>
                      {driver.vehicle_name ? (
                        <span className="assigned">
                          {driver.vehicle_name}
                        </span>
                      ) : (
                        <span className="not-assigned">
                          Not Assigned
                        </span>
                      )}
                    </td>

                    <td>
                      {driver.active ? (
                        <span className="active">
                          Active
                        </span>
                      ) : (
                        <span className="inactive">
                          Deactivated
                        </span>
                      )}
                    </td>

                    <td>
                      <select
                        className="vehicle-input"
                        value={driver.vehicle_assigned || ""}
                        onChange={(e) =>
                          assignVehicle(driver.id, e.target.value)
                        }
                      >
                        <option value="">Select Vehicle</option>

                        {vehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.vehicle_name} ({vehicle.registration_number})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            setEditingDriver({ ...driver })
                          }
                        >
                          Edit
                        </button>

                     <button
                       className={driver.active ? "deactivate-btn" : "activate-btn"}
                       onClick={() => toggleStatus(driver.id)}
                     >
                       {driver.active ? "Deactivate" : "Activate"}
                     </button>
                     
                     <button
                       className="delete-btn"
                       onClick={() => deleteDriver(driver.id)}
                     >
                       Delete
                     </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No Drivers Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

     
      {editingDriver && (
        <div className="driver-overlay">
          <div className="driver-modal">
      
            <h2 className="table-title">Edit Driver</h2>
      
            <div className="modal-body">
      
              <label>Username</label>
              <input
                type="text"
                className="vehicle-input"
                value={editingDriver.username}
                onChange={(e) =>
                  setEditingDriver({
                    ...editingDriver,
                    username: e.target.value,
                  })
                }
              />
      
              <label>Email</label>
              <input
                type="email"
                className="vehicle-input"
                value={editingDriver.email}
                onChange={(e) =>
                  setEditingDriver({
                    ...editingDriver,
                    email: e.target.value,
                  })
                }
              />
      
            </div>
      
            <div className="action-buttons modal-buttons">
              <button
                className="save-btn"
                onClick={updateDriver}
              >
                Save Changes
              </button>
      
              <button
                className="cancel-btn"
                onClick={() => setEditingDriver(null)}
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
export default DriverManagement;