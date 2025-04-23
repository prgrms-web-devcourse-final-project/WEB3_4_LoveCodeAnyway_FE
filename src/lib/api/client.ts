import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === "development"
  ? "http://localhost:8080"
  : "https://api.ddobang.site";

export const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
}); 