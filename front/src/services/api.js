// src/services/api.js

export const explainText = async (text) => {
  const response = await fetch("http://127.0.0.1:8000/api/explain/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return await response.json();
};

export const chatAboutReport = async (reportText, question) => {
  const response = await fetch("http://127.0.0.1:8000/api/chat/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report_text: reportText, question }),
  });
  return await response.json();
};

const API_BASE = "http://127.0.0.1:8000/api";

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
