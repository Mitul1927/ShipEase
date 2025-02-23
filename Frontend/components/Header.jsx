import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reduxStore/authSlice2";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Header.css';
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await axios.post('http://localhost:3000/user/logout');
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-[#122C34]  text-[#4EA5D9] py-4 px-6 flex items-center justify-between shadow-md w-full">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}> 
        <img src="/vite.svg" alt="Logo" className="h-10" />
        <h1 className="text-2xl font-bold">ShipEase</h1>
      </div>
      

      <div className="hidden md:block overflow-hidden w-64 h-6 relative">
        <div className="animate-text-slide text-sm text-[#44CFCB] font-semibold absolute top-2">
          <span>Track your shipments with ease 🚛</span>
          <span>Secure and Fast Cargo Services ✈️</span>
          <span>Real-time updates for your shipments 📦</span>
        </div>
      </div>

      <button className="md:hidden text-[#4EA5D9]" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <nav className={`absolute z-10 md:relative top-16 md:top-auto left-0 w-full md:w-auto bg-[#122C34] md:bg-transparent flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0 p-4 md:p-0 ${menuOpen ? "block" : "hidden md:flex"}`}>
        {isAuthenticated ? (
          <>
            <Link to="/" className="hover:text-[#44CFCB]">Home</Link>
            <Link to="/about" className="hover:text-[#44CFCB]">About Us</Link>
            <Link to="/shipments" className="hover:text-[#44CFCB]">All Shipments</Link>
            <Link to="/dashboard" className="hover:text-[#44CFCB]">Dashboard</Link>
            <button
              className="bg-[#2A4494] hover:bg-[#4EA5D9] text-white px-4 py-2 rounded cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="bg-[#4EA5D9] hover:bg-[#44CFCB] cursor-pointer text-white px-4 py-2 rounded"
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
