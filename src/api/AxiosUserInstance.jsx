import axios from "axios";

const AxiosUserInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

AxiosUserInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosUserInstance;
