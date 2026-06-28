import axios from "axios";

import { apiBaseUrl } from "../constants";

const apiInstance = axios.create({
  baseURL: apiBaseUrl,
});

export default apiInstance;
