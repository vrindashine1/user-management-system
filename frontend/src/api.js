
import axios from "axios";

const api = axios.create({
  baseURL: "https://user-management-backend-oh6q.onrender.com",
  // baseURL: "http://localhost:5000",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default api;
