import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (
        ![
          "/authentication",
          "/authentication/sign-in",
          "/authentication/sign-up",
        ].includes(window.location.pathname)
      ) {
        window.location.href = "/authentication/sign-in";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
