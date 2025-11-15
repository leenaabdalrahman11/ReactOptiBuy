import axios from "axios";
const token = localStorage.getItem("userToken");
const AxiosUserInstance = axios.create({
    baseURL:`http://localhost:3000`,
    headers:{
        Authorization:`Leena ${token}`
    }
});

export default AxiosUserInstance;