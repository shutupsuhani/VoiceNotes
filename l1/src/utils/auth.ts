// utils.ts

import axios from "axios";

// Axios instance for auth-related requests
const API = axios.create({
  baseURL: "https://voice-notes-backend.vercel.app/api/auth",
  withCredentials: true, // send/receive cookies
});

// Get current user from JWT stored in localStorage
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      _id: payload._id,
      username: payload.username,
      email: payload.email,
    };
  } catch {
    return null;
  }
};

// Fetch user notes (includes credentials)
export const fetchUserNotesAPI = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("https://voice-notes-backend.vercel.app/api/notes/getnotes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include", // <-- important for cookies
  });

  if (!res.ok) throw new Error("Failed to fetch notes");
  return await res.json(); // returns array of VoiceNote
};

// Auth APIs
export const signup = async (data: { username: string; email: string; password: string }) => {
  const res = await API.post("/signup", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await API.post("/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await API.get("/logout", { withCredentials: true });
  return res.data;
};
