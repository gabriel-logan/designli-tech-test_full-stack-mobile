import axios from "axios";

import { apiBaseUrl } from "../constants";
import { useUserStore } from "../stores/userStore";

const apiInstance = axios.create({
  baseURL: apiBaseUrl,
});

apiInstance.interceptors.request.use(config => {
  const token = useUserStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiInstance;
