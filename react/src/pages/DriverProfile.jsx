import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./DriverProfile.css";

function DriverProfile() {
  const userId = localStorage.getItem("user_id");

  const [licenseFile, setLicenseFile] = useState(null);

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    role: "",
    active: true,

    driving_license: "",
    license_expiry_date: "",
    driver_address: "",
    experience_years: "",

    created_at: "",
    created_by: "",
    updated_at: "",
    updated_by: "",
    joined_on: "",

    profile_image: null,

    assigned_vehicle_name: "",
  });

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/DriverProfile/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUser({
      ...user,
      profile_image: URL.createObjectURL(file),
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(
        `/DriverProfile/upload-image/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchProfile();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const valid =
      file.type === "application/pdf" ||
      file.type.startsWith("image/");

    if (!valid) {
      alert("Only PDF and Image files are allowed");
      return;
    }

    setLicenseFile(file);
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);
      formData.append("email", user.email);
      formData.append("dob", user.dob);
      formData.append(
        "license_expiry_date",
        user.license_expiry_date
      );
      formData.append(
        "driver_address",
        user.driver_address
      );
      formData.append(
        "experience_years",
        user.experience_years
      );

      if (licenseFile) {
        formData.append(
          "driving_license",
          licenseFile
        );
      }

      await api.put(
        `/DriverProfile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile Updated Successfully");
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="driver-profile-page">
      <div className="driver-profile-card">
        <h2>🚚 Driver Profile</h2>

        <p>
          <b>User ID:</b> {userId}
        </p>

        <div className="profile-image-section">
          <img
            src={
              user.profile_image
                ? user.profile_image.startsWith("blob:")
                  ? user.profile_image
                  : `http://127.0.0.1:8000/${user.profile_image}`
                : "https://dummyimage.com/150x150/cccccc/000000&text=Driver"
            }
            alt="Profile"
            className="profile-image"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="license-section">
          <label>Driving License (PDF/Image)</label>

          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleLicenseChange}
            className="input"
          />
        </div>

        <div className="form-grid">
          <Input
            label="First Name"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
          />

          <Input
            label="Last Name"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />

          <Input
            label="Role"
            value={user.role}
            readOnly
          />

          <Input
            type="date"
            label="DOB"
            name="dob"
            value={user.dob || ""}
            onChange={handleChange}
          />

          <Input
            type="date"
            label="License Expiry Date"
            name="license_expiry_date"
            value={user.license_expiry_date || ""}
            onChange={handleChange}
          />

          <Input
            label="Experience (Years)"
            name="experience_years"
            value={user.experience_years || ""}
            onChange={handleChange}
          />

          <Input
            label="Assigned Vehicle"
            value={
              user.assigned_vehicle_name ||
              "Assigned By Admin / Manager"
            }
            readOnly
          />

          <Input
            label="Active"
            value={user.active ? "Yes" : "No"}
            readOnly
          />

          <Input
            label="Created By"
            value={user.created_by || ""}
            readOnly
          />

          <Input
            label="Created At"
            value={user.created_at || ""}
            readOnly
          />

          <Input
            label="Updated At"
            value={user.updated_at || ""}
            readOnly
          />
        </div>

        <div className="address-section">
          <label>Driver Address</label>

          <textarea
            name="driver_address"
            value={user.driver_address || ""}
            onChange={handleChange}
            rows="4"
            className="textarea"
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          className="update-btn"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label>{label}</label>
      <input {...props} className="input" />
    </div>
  );
}

export default DriverProfile;