import { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");

  const limit = 10;

  const fetchUsers = async () => {
    try {
      const res = await api.get(
        `/api/admin/users?page=${page}&limit=${limit}`
      );
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setMessage("❌ Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const toggleStatus = async (id, action) => {
    const confirm = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    if (!confirm) return;

    try {
      await api.patch(`/api/admin/users/${id}/${action}`);
      setMessage(`✅ User ${action}d successfully`);
      fetchUsers();
    } catch (err) {
      setMessage("❌ Action failed");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {message && <p>{message}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.fullName}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                {u.status === "active" ? (
                  <button
                    onClick={() => toggleStatus(u._id, "deactivate")}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => toggleStatus(u._id, "activate")}
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
