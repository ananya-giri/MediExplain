import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to MediExplain 🩺</h1>
      <p className="text-gray-700 mb-8 max-w-md text-center">
        Upload your medical reports, and let AI explain them in simple terms you can understand.
      </p>
      <div className="flex gap-4">
        <Link
          to="/signup"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;
