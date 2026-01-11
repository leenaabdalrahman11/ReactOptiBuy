import axios from "axios";

const AxiosUserInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const getSessionId = () => {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = "guest_" + Date.now() + "_" + Math.random().toString(36).substring(2);
    localStorage.setItem("sessionId", sid);
  }
  return sid;
};

AxiosUserInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  const sid = localStorage.getItem("sessionId") || getSessionId();

  config.headers = config.headers || {};

  config.headers["x-session-id"] = sid;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default AxiosUserInstance;
