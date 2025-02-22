import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reduxStore/authSlice2";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    const res = axios.post('http://localhost:3000/user/logout');
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-[#122C34] text-[#4EA5D9] py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/vite.svg" alt="Logo" className="h-10" />
        <h1 className="text-2xl font-bold">Cargo Tracker</h1>
      </div>
      
      {/* Animated Text */}
      <div className="overflow-hidden w-64 h-6 relative">
        <div className="animate-text-slide text-sm text-[#44CFCB] font-semibold absolute top-2">
          <span>Track your shipments with ease 🚛</span>
          <span>Secure and Fast Cargo Services ✈️</span>
          <span>Real-time updates for your shipments 📦</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/" className="hover:text-[#44CFCB] cursor-pointer">Home</Link>
            <Link to="/about" className="hover:text-[#44CFCB] cursor-pointer">About Us</Link>
            <Link to="/shipments" className="hover:text-[#44CFCB] cursor-pointer">All Shipments</Link>
            <Link to="/dashboard" className="hover:text-[#44CFCB] cursor-pointer">Dashboard</Link>
            <button
              className="bg-[#2A4494] hover:bg-[#4EA5D9] text-white px-4 py-2 rounded cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="bg-[#4EA5D9] hover:bg-[#44CFCB] text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
