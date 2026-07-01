import React, { useState } from "react";
import "./VehicleTable.css";

function VehicleTable({
  vehicles,
  handleEdit,
  handleDelete,
  handleAssign,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = vehicles.filter((v) =>
    `${v.vehicle_name}
     ${v.vehicle_model}
     ${v.registration_number}
     ${v.vehicle_type}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-container">
      <h2 className="table-title">
        📋 All Vehicles
      </h2>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Vehicle Name, Model, Registration Number..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <div className="table-wrapper">
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Vehicle Name</th>
              <th>Model</th>
              <th>Year</th>
              <th>Type</th>
              <th>Chassis No.</th>
              <th>Registration No.</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>

                  <td>
                    {v.vehicle_photo ? (
                      <img
                        src={`http://127.0.0.1:8000/${v.vehicle_photo}`}
                        alt="vehicle"
                        className="vehicle-photo"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>{v.vehicle_name}</td>
                  <td>{v.vehicle_model}</td>
                  <td>{v.vehicle_year}</td>
                  <td>{v.vehicle_type}</td>
                  <td>{v.chassi_number}</td>
                  <td>{v.registration_number}</td>
                  <td>{v.status}</td>
                  <td>{v.created_by}</td>

                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(v)}
                    >
                      Edit
                    </button>



                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(v.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="no-data">
                  No Vehicles Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VehicleTable;