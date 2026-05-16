// src/services/api.js

const API_BASE = import.meta.env.VITE_API_URL || "https://mediexplain-a9wb.onrender.com/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/upload/`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload file");
  return await response.json();
};

export const explainText = async (text) => {
  const response = await fetch(`${API_BASE}/explain/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders() 
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Failed to explain text");
  return await response.json();
};

export const chatAboutReport = async (data) => {
  const response = await fetch(`${API_BASE}/chat/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders() 
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to chat about report");
  return await response.json();
};

// ✅ Signup
export const signupUser = async (data) => {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    return {
      success: res.ok,
      message: result.message || result.detail || "Signup failed",
    };
  } catch {
    return { success: false, message: "Network error" };
  }
};

// ✅ Login
export const loginUser = async (data) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.detail || "Invalid credentials" };
    }

    return {
      success: true,
      token: result.token,
      name: result.name,
      message: result.message,
    };
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");

  const response = await fetch(`${API_BASE}/transcribe/`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!response.ok) throw new Error("Audio transcription failed");
  return await response.json();
};

export const getHistory = async () => {
  const response = await fetch(`${API_BASE}/history/`, {
    method: "GET",
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch history");
  return await response.json();
};

export const deleteHistory = async (reportId) => {
  const response = await fetch(`${API_BASE}/history/${reportId}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error("Failed to delete history");
  return await response.json();
};
