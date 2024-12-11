import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Use Vercel backend URL here
  withCredentials: true,
});

export default axiosInstance;
