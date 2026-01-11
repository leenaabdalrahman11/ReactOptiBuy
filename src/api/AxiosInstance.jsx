import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

export default AxiosInstance;
