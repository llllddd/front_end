// src/lib/api/client.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const HTTP_TIMEOUT = Number(process.env.NEXT_PUBLIC_HTTP_TIMEOUT ?? 8000);

if (!API_URL) {
  // Optional: fail fast in dev if env is missing
  console.warn("NEXT_PUBLIC_API_URL is not defined");
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: HTTP_TIMEOUT,
  // include credentials (cookies) on requests so server session cookies are sent
  // (required when your backend uses cookie-based sessions and expects req.user)
  withCredentials: true,
  // you can add headers, withCredentials, etc. here if needed
});

// Optional: response interceptors, error logging, etc.
// apiClient.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     console.error("API error:", err);
//     throw err;
//   },
// );
