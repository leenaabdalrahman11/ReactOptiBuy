import axios from "axios";

const AxiosSessionInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getSessionId = () => {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = "guest_" + Date.now() + "_" + Math.random().toString(36).substring(2);
    localStorage.setItem("sessionId", sid);
  }
  return sid;
};

AxiosSessionInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  const sessionId = getSessionId();

  config.headers = config.headers || {};

  config.headers["x-session-id"] = sessionId;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default AxiosSessionInstance;
