import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);

    if (res.success) {
      // ✅ Store token + user details
      localStorage.setItem("token", res.token);
      localStorage.setItem("username", res.name);

      // ✅ Update global auth context
      login({ name: res.name, token: res.token });

      // ✅ Redirect to home
      navigate("/home");
    } else {
      setError(res.message || "Invalid login credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-80 flex flex-col gap-3"
      >
        <h2 className="text-lg font-semibold text-center mb-2">Login</h2>

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

        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
