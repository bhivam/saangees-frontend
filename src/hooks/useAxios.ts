import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import { refreshAccessToken } from "../utils/auth";

const useAxios = () => {
  const { auth, setAuth } = useAuth();

  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use(
    async (config) => {
      if (auth.accessToken) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          setAuth({ isAuthenticated: false, accessToken: null, user: null });
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
