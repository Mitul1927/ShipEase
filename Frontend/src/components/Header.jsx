import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  let image = null;
  let username = null;
  let isAuthenticated = false;

  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    image = decodedToken.image;
    username = decodedToken.username;
    isAuthenticated = true;
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = async () => {
    await axios.post(`${backendUrl}/user/logout`);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="bg-[#122C34] text-[#4EA5D9] py-4 px-6 flex items-center justify-between shadow-md w-full">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/logo.jpg" alt="Logo" className="h-10 rounded-2xl" />
        <h1 className="text-2xl font-bold">ShipEase</h1>
      </div>

      <div className="hidden lg:block overflow-hidden w-64 h-6 relative">
        <div className="animate-text-slide text-sm text-[#44CFCB] font-semibold absolute top-2">
          <span>Track your shipments with ease 🚛</span>
          <span>Secure and Fast Cargo Services ✈️</span>
          <span>Real-time updates for your shipments 📦</span>
        </div>
      </div>

      {image ? (
        <img src={image} alt="User" className="h-10 w-10 rounded-full border-2 block border-[#4EA5D9] lg:hidden cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
      ) : (
        <button className="md:hidden text-[#4EA5D9]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      )}

      <nav className={`absolute z-10 lg:relative top-16 lg:top-auto left-0 w-full lg:w-auto bg-[#122C34] lg:bg-transparent flex flex-col lg:flex-row items-center lg:space-x-4 space-y-4 lg:space-y-0 p-4 lg:p-0 ${menuOpen ? "block" : "hidden lg:flex"}`}>
        <Link to="/about" onClick={()=>(setMenuOpen(false))} className="hover:text-[#44CFCB]">About Us</Link>
        <Link to="/allShipments" onClick={()=>(setMenuOpen(false))} className="hover:text-[#44CFCB]">All Shipments</Link>

        {isAuthenticated ? (
          <>
          <Link onClick={()=>(setMenuOpen(false))} to="/addShipment" className="hover:text-[#44CFCB]">Add Shipment</Link>
            <Link onClick={()=>(setMenuOpen(false))} to="/dashboard/userInfo" className="hover:text-[#44CFCB]">Dashboard</Link>

            <div className="flex hover:bg-[#4EA5D9] cursor-pointer items-center bg-[#2A4494] px-3 py-2 rounded-lg space-x-3 shadow-md">
              {image && <img src={image} alt="User" className="h-8 w-8 rounded-full border-2 border-[#4EA5D9]" />}
              <span className="text-white font-medium">{username}</span>
            </div>

            <button className="bg-[#2A4494] hover:bg-[#4EA5D9] text-white px-4 py-2 rounded cursor-pointer" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="bg-[#4EA5D9] hover:bg-[#44CFCB] cursor-pointer text-white px-4 py-2 rounded" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
