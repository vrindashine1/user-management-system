import { getUser, logout } from "../utils/auth";

export default function Navbar() {
  const user = getUser();
  if (!user) return null;

  return (
    <div style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      <span>
        {user.role.toUpperCase()}
      </span>

      {user.role === "admin" && (
        <a href="/admin" style={{ marginLeft: 10 }}>Admin</a>
      )}

      <a href="/profile" style={{ marginLeft: 10 }}>Profile</a>
      <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
    </div>
  );
}
