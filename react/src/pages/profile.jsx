import React, { useState, useEffect } from "react";
import api from "../services/api";


function Profile() {
  const userId = localStorage.getItem("user_id");

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    role: "",
    active: true,
    created_at: "",
    created_by: "",
    updated_at: "",
    updated_by: "",
    joined_on: "",
    profile_image: null,
  });

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put(`/profile/${userId}`, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        dob: user.dob,
        role: user.role,
        active: user.active,
        updated_at: new Date(),
      });

      alert("Profile Updated");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
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
      await api.post(`/profile/upload-image/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="driver-profile-page">
      <div className="driver-profile-card">
        <h2>User Profile</h2>

        {/* IMAGE */}
        <div className="profile-image-section">
          <img
            className="profile-image"
            src={
              user.profile_image
                ? user.profile_image.startsWith("blob:")
                  ? user.profile_image
                  : `http://127.0.0.1:8000/${user.profile_image}`
                : "https://dummyimage.com/150x150/cccccc/000000&text=User"
            }
            alt="profile"
          />

          <input type="file" onChange={handleImageChange} />
        </div>

        {/* FORM */}
        <div className="form-grid">
          <Input label="First Name" name="first_name" value={user.first_name} onChange={handleChange} />
          <Input label="Last Name" name="last_name" value={user.last_name} onChange={handleChange} />
          <Input label="Email" name="email" value={user.email} onChange={handleChange} />
          <Input label="Role" name="role" value={user.role} onChange={handleChange} />
          <Input type="date" label="DOB" name="dob" value={user.dob || ""} onChange={handleChange} />

          <Input label="Active" value={user.active ? "Yes" : "No"} readOnly />
          <Input label="Created At" value={user.created_at} readOnly />
          <Input label="Created By" value={user.created_by} readOnly />
          <Input label="Updated At" value={user.updated_at} readOnly />
          <Input label="Updated By" value={user.updated_by} readOnly />
          <Input label="Joined On" value={user.joined_on} readOnly />
        </div>

        <button className="update-btn" onClick={handleUpdateProfile}>
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
      <input className="input" {...props} />
    </div>
  );
}

export default Profile;