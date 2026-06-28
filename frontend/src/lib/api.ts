import axios from "axios";

import { apiBaseUrl } from "../constants";
import { useAuthStore } from "../stores/authStore";

const apiInstance = axios.create({
  baseURL: apiBaseUrl,
});

apiInstance.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiInstance;
