import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "restaurant-ochre-alpha.vercel.app/api", // Use Vercel backend URL here
  withCredentials: true,
});

export default axiosInstance;
