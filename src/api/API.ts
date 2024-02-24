import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8765/api",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// Response Interceptor
API.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    // You can handle HTTP errors here
    if (error?.response?.status) {
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);
export interface APIResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
export default API;
