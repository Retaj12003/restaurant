import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "restaurant-ochre-alpha.vercel.app/api", 
  withCredentials: true,
});

export default axiosInstance;
