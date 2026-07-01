import React from "react";
import "./VehicleForm.css";

function VehicleForm({
  vehicle,
  handleChange,
  handlePhotoChange,
  preview,
  editingId,
  handleSubmit,
  handleUpdate,
  resetForm,
}) {
  return (
    <div className="vehicle-form">

      <div className="vehicle-image-section">
        <img
          src={
            preview ||
            "https://dummyimage.com/250x180/cccccc/000000&text=Vehicle"
          }
          alt="vehicle"
          className="vehicle-image"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="file-input"
        />
      </div>

      <div className="vehicle-grid">

        <div>
          <label>Vehicle Name</label>
          <input
            className="vehicle-input"
            name="vehicle_name"
            value={vehicle.vehicle_name}
            onChange={handleChange}
            placeholder="Vehicle Name"
          />
        </div>

        <div>
          <label>Vehicle Model</label>
          <input
            className="vehicle-input"
            name="vehicle_model"
            value={vehicle.vehicle_model}
            onChange={handleChange}
            placeholder="Vehicle Model"
          />
        </div>

        <div>
          <label>Vehicle Year</label>
          <input
            className="vehicle-input"
            type="number"
            name="vehicle_year"
            value={vehicle.vehicle_year}
            onChange={handleChange}
            placeholder="Vehicle Year"
          />
        </div>

        <div>
          <label>Vehicle Type</label>
          <select
            className="vehicle-input"
            name="vehicle_type"
            value={vehicle.vehicle_type}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="LTV">LTV</option>
            <option value="HTV">HTV</option>
          </select>
        </div>

        <div>
          <label>Chassis Number</label>
          <input
            className="vehicle-input"
            name="chassi_number"
            value={vehicle.chassi_number}
            onChange={handleChange}
            placeholder="Chassis Number"
          />
        </div>

        <div>
          <label>Registration Number</label>
          <input
            className="vehicle-input"
            name="registration_number"
            value={vehicle.registration_number}
            onChange={handleChange}
            placeholder="Registration Number"
          />
        </div>

        <div>
          <label>Status</label>
          <select
            className="vehicle-input"
            name="status"
            value={vehicle.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label>Created By</label>
          <input
            className="vehicle-input"
            name="created_by"
            value={vehicle.created_by || ""}
            readOnly
          />
        </div>
        
        <div>
          <label>Updated By</label>
          <input
            className="vehicle-input"
            name="updated_by"
            value={vehicle.updated_by || ""}
            readOnly
          />
        </div>

      </div>

     
      <div className="description-section">
        <label>Vehicle Description</label>

        <textarea
          className="vehicle-textarea"
          name="vehicle_description"
          value={vehicle.vehicle_description}
          onChange={handleChange}
          rows="5"
          placeholder="Enter Vehicle Description"
        />
      </div>

      
      <div className="vehicle-grid">
        <div>
          <label>Created On</label>
          <input
            className="vehicle-input"
            value={new Date().toLocaleString()}
            readOnly
          />
        </div>

        <div>
          <label>Updated On</label>
          <input
            className="vehicle-input"
            value={new Date().toLocaleString()}
            readOnly
          />
        </div>
      </div>

    
      <div className="btn-group">

        <button
          type="button"
          className="vehicle-btn"
          onClick={editingId ? handleUpdate : handleSubmit}
        >
          {editingId ? "Update Vehicle" : "Save Vehicle"}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={resetForm}
          >
            ✖ Cancel
          </button>
        )}

      </div>

    </div>
  );
}

export default VehicleForm;