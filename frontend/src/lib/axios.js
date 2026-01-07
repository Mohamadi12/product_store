import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Envoie de cookies avec chaque requête HTTP
});

export default api;