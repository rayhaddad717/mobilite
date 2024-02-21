import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8765/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
export interface APIResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
export default API;
