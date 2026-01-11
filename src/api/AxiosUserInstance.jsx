import axios from "axios";

const AxiosUserInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
});

AxiosUserInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  const sid = localStorage.getItem("sessionId");

  config.headers = config.headers || {};
  if (sid) config.headers["x-session-id"] = sid;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default AxiosUserInstance;
