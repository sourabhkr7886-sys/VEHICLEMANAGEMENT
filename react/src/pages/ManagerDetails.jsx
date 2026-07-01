import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./ManagerDetails.css";

function ManagerDetails() {
  const [managers, setManagers] = useState([]);
  const [editingManager, setEditingManager] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await api.get("/user/managers");
      setManagers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteManager = async (id) => {
    if (!window.confirm("Delete this manager?")) return;

    try {
      await api.delete(`/user/managers/${id}`);
      alert("Manager deleted successfully");
      fetchManagers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const updateManager = async () => {
    try {
      await api.put(`/user/managers/${editingManager.id}`, {
        username: editingManager.username,
        first_name: editingManager.first_name,
        last_name: editingManager.last_name,
        email: editingManager.email,
        dob: editingManager.dob,
      });

      alert("Manager updated successfully");
      setEditingManager(null);
      fetchManagers();
    } catch (err) {
      alert("Update failed");
    }
  };

  const filteredManagers = managers.filter((manager) =>
    (
      manager.username +
      " " +
      manager.first_name +
      " " +
      manager.last_name +
      " " +
      manager.email
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="driver-container">

      <h2 className="page-title">Manager Management</h2>

      <div className="search-container">
        <input
          className="search-input"
          placeholder="Search Manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="driver-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredManagers.length > 0 ? (
              filteredManagers.map((manager) => (
                <tr key={manager.id}>
                  <td>{manager.id}</td>
                  <td>{manager.username}</td>
                  <td>{manager.first_name}</td>
                  <td>{manager.last_name}</td>
                  <td>{manager.email}</td>
                  <td>{manager.dob}</td>
                  <td>{manager.role}</td>

                  <td>
                    {manager.active ? (
                      <span className="active-status">
                        Active
                      </span>
                    ) : (
                      <span className="inactive-status">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        setEditingManager({ ...manager })
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteManager(manager.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No Managers Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingManager && (
        <div className="driver-details-overlay">
          <div className="driver-details-modal">

            <h3>Edit Manager</h3>

            <input
              type="text"
              placeholder="Username"
              value={editingManager.username || ""}
              onChange={(e) =>
                setEditingManager({
                  ...editingManager,
                  username: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="First Name"
              value={editingManager.first_name || ""}
              onChange={(e) =>
                setEditingManager({
                  ...editingManager,
                  first_name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Last Name"
              value={editingManager.last_name || ""}
              onChange={(e) =>
                setEditingManager({
                  ...editingManager,
                  last_name: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={editingManager.email || ""}
              onChange={(e) =>
                setEditingManager({
                  ...editingManager,
                  email: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={editingManager.dob || ""}
              onChange={(e) =>
                setEditingManager({
                  ...editingManager,
                  dob: e.target.value,
                })
              }
            />

            <div className="driver-details-buttons">

              <button
                className="save-btn"
                onClick={updateManager}
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditingManager(null)
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

export default ManagerDetails;