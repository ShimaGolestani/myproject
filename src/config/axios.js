/* eslint-disable */
import axios from "axios";
import RefreshToken from "../Utils/RefreshToken";
const baseURL = "http://192.168.110.113:8081/api/v1";

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      RefreshToken();
    } else {
      return (
        Promise.reject(error.response && error.response.data) ||
        "Something went wrong"
      );
    }
  }
);

export default axiosInstance;
