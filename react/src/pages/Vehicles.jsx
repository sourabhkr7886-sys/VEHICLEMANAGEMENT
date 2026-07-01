import React, { useState, useEffect } from "react";
import api from "../services/api";

import VehicleForm from "../pages/VehicleForm";
import VehicleTable from "../pages/VehicleTable";

import "./Vehicles.css";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [vehicle, setVehicle] = useState({
    vehicle_name: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_type: "",
    chassi_number: "",
    registration_number: "",
    vehicle_description: "",
    status: "Active",
    created_by: "",
    updated_by: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles/");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/vehicles/${id}`);

      alert("Vehicle deleted successfully");
      fetchVehicles();
    } catch (error) {
      console.error(error);
      alert("Failed to delete vehicle");
    }
  };

  const handleEdit = (v) => {
    setEditingId(v.id);

    setVehicle({
      vehicle_name: v.vehicle_name || "",
      vehicle_model: v.vehicle_model || "",
      vehicle_year: v.vehicle_year || "",
      vehicle_type: v.vehicle_type || "",
      chassi_number: v.chassi_number || "",
      registration_number: v.registration_number || "",
      vehicle_description: v.vehicle_description || "",
      status: v.status || "Active",
      created_by: v.created_by || "",
      updated_by: v.updated_by || "",
    });

    if (v.vehicle_photo) {
      setPreview(
        `http://127.0.0.1:8000/${v.vehicle_photo}`
      );
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setVehicle({
      vehicle_name: "",
      vehicle_model: "",
      vehicle_year: "",
      vehicle_type: "",
      chassi_number: "",
      registration_number: "",
      vehicle_description: "",
      status: "Active",
      created_by: "",
      updated_by: "",
    });

    setPhoto(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.keys(vehicle).forEach((key) => {
        formData.append(key, vehicle[key]);
      });

      if (photo) {
        formData.append("vehicle_photo", photo);
      }

      await api.post("/vehicles/", formData);

      alert("Vehicle Added Successfully");

      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error(error);
      alert("Failed to add vehicle");
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(vehicle).forEach((key) => {
        formData.append(key, vehicle[key]);
      });

      if (photo) {
        formData.append("vehicle_photo", photo);
      }

      await api.put(`/vehicles/${editingId}`, formData);

      alert("Vehicle Updated Successfully");

      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error(error);
      alert("Failed to update vehicle");
    }
  };

  const handleAssign = (vehicle) => {
    alert(`Assign Vehicle: ${vehicle.vehicle_name}`);
  };

  return (
    <div className="vehicles-container">
      <h2 className="vehicles-title">
        Vehicle Management
      </h2>

      <div className="vehicle-card">
        <VehicleForm
          vehicle={vehicle}
          handleChange={handleChange}
          handlePhotoChange={handlePhotoChange}
          preview={preview}
          editingId={editingId}
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
          resetForm={resetForm}
        />
      </div>

      <div className="vehicle-card">
        <VehicleTable
          vehicles={vehicles}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleAssign={handleAssign}
        />
      </div>
    </div>
  );
}

export default Vehicles;