import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, FileClock, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLanding = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isLanding ? "bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/10" : "bg-white shadow-sm border-b border-gray-100"}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1
          onClick={() => navigate(token ? "/home" : "/")}
          className={`text-2xl font-extrabold cursor-pointer tracking-tight flex items-center gap-2 ${isLanding ? "text-white" : "text-gray-900"}`}
        >
          <span className="text-teal-500 text-3xl leading-none">+</span> MediExplain
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-6 relative">
          <button
            onClick={() => navigate("/about")}
            className={`font-medium transition-colors ${isLanding ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            About
          </button>

          {!token ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
              className={`px-5 py-2 rounded-full font-semibold transition-all ${isLanding ? "bg-white text-gray-900 hover:bg-gray-200" : "bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/30"}`}
            >
              Log in
            </motion.button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-3 px-2 py-1 pr-4 rounded-full font-medium transition-all ${isLanding ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200"}`}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name || "User"}&background=14B8A6&color=fff&bold=true`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full shadow-sm"
                />
                <span>{user.name || "User"}</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden text-gray-700"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                        className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" /> Profile
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); navigate("/history"); }}
                        className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <FileClock className="w-4 h-4 text-gray-400" /> History
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
