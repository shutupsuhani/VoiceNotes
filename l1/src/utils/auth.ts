//utils.ts

import axios from "axios";

const API = axios.create({
  baseURL: "https://voice-notes-backend.vercel.app/api/auth",
  withCredentials: true, // allow sending/receiving cookies
});

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

export const fetchUserNotesAPI = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("https://voice-notes-backend.vercel.app/api/notes/getnotes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return await res.json(); // should return array of VoiceNote
};


export const signup = async (data: { username: string; email: string; password: string }) => {
  const res = await API.post("/signup", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await API.post("/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await API.get("/logout");
  return res.data;
};
