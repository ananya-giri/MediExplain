import React, { useState } from "react";
import { signupUser } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signupUser(form);
    setMessage(res.message);
    if (res.success) {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-80 flex flex-col gap-3"
      >
        <h2 className="text-lg font-semibold text-center mb-2">Create Account</h2>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded p-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border rounded p-2"
          required
        />
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Sign Up
        </button>
        {message && <p className="text-sm text-center text-blue-500">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
