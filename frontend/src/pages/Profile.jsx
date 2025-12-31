import { useEffect, useState } from "react";
import api from "../api";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [original, setOriginal] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // change password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = localStorage.getItem("token");

  // fetch profile
  useEffect(() => {
    api
      .get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFullName(res.data.fullName);
        setEmail(res.data.email);
        setOriginal(res.data);
      })
      .catch(() => setError("Failed to load profile"));
  }, [token]);

  // save profile
  const saveProfile = async () => {
    setMessage("");
    setError("");
    try {
      await api.put(
        "/api/users/profile",
        { fullName, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  // cancel changes
  const cancelEdit = () => {
    setFullName(original.fullName);
    setEmail(original.email);
    setMessage("");
    setError("");
  };

  // change password
  const changePassword = async () => {
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      return setError("All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await api.put(
        "/api/users/change-password",
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={saveProfile}>Save</button>
        <button onClick={cancelEdit}>Cancel</button>
      </div>

      <hr />

      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={changePassword}>Change Password</button>
    </div>
  );
}
