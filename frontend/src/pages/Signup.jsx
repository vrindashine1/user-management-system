import { useState } from "react";
import api from "../api";

export default function Signup() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  const signup = async () => {
    if (!data.fullName || !data.email || !data.password || !data.confirm)
      return setError("All fields required");

    if (data.password !== data.confirm)
      return setError("Passwords do not match");

    try {
      await api.post("/api/auth/signup", data);
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{color:"red"}}>{error}</p>}
      <input placeholder="Full Name" onChange={e=>setData({...data,fullName:e.target.value})} />
      <input placeholder="Email" onChange={e=>setData({...data,email:e.target.value})} />
      <input type="password" placeholder="Password"
        onChange={e=>setData({...data,password:e.target.value})} />
      <input type="password" placeholder="Confirm Password"
        onChange={e=>setData({...data,confirm:e.target.value})} />
      <button onClick={signup}>Signup</button>
      <p>
        Already have an account?{" "}
        <a href="/login">Login</a>
      </p>
    </div>
  );
}
