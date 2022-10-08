/* eslint-disable */
import axios from "axios";
import axiosInstance from "../config/axios";

const RefreshToken = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const token = localStorage.getItem("Token");
  if (token) {
    const { refresh_token } = JSON.parse(token);
    axios({
      url: "http://192.168.110.113:8081/api/v1/user/refresh_token",
      headers: { Authorization: refresh_token },
      method: "GET",
      cancelToken: source.token,
    })
      .then((response) => {
        if (response.status < 300) {
          const newToken = { refresh_token, ...response.data };
          localStorage.setItem("Token", JSON.stringify(newToken));
          axiosInstance.defaults.headers.common.Authorization = `${response.data.token}`;
        }
      })
      .catch((thrown) => {
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        }
      });
  }
};
export default RefreshToken;
