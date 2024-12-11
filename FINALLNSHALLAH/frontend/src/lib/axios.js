import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "restaurant-ochre-alpha.vercel.app", 
  withCredentials: true,
});

export default axiosInstance;
