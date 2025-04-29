// make a axios instance with base url and interceptors
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export default axiosInstance;
