// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";


// function App() {
//   return (
//     <div>
//       <Navbar/>
//     <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      
//       <h1 className="text-4xl font-bold text-blue-700 mb-4">
//         🩺 MediExplain
//       </h1>
//       {/* <p className="text-lg text-gray-700">
//         Upload your medical report to get AI-powered explanations!
//       </p> */}
//       <Home/>
//     </div>
//     </div>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/landing";
import Home from "./pages/Home";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import About from "./pages/About";
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Navbar/>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path ="/about" element={<About/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

