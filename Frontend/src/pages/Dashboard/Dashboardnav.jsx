import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaTruck, FaChartBar, FaBars, FaTimes } from "react-icons/fa";

const DashboardNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden fixed h-10 top-18 right-80  z-50 text-white text-2xl p-2 m-4 bg-[#224870] rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`fixed md:relative bg-[#224870] text-white min-h-screen rounded-2xl  transition-all duration-300 
        ${isOpen ? "w-60 z-40 p-6" : "w-0 p-0"} md:w-1/4 md:p-6`}
      >
        <h2 onClick={()=>(setIsOpen(false))} className={`text-2xl font-bold text-center transition-all duration-300 ${isOpen ? "block" : "hidden"} md:block`}>
          Dashboard
        </h2>

        <div className="mt-6 space-y-4">
          <NavLink
          onClick={()=>(setIsOpen(false))}
            to="/dashboard/userInfo"
            className="flex items-center space-x-3 p-3 hover:bg-[#2A4494] rounded-lg transition"
          >
            <FaUser />
            <span className={`${isOpen ? "block" : "hidden"} md:block`}>User Information</span>
          </NavLink>

          <NavLink
          onClick={()=>(setIsOpen(false))}
            to="/dashboard/shipments"
            className="flex items-center space-x-3 p-3 hover:bg-[#2A4494] rounded-lg transition"
          >
            <FaTruck />
            <span className={`${isOpen ? "block" : "hidden"} md:block`}>My Shipments</span>
          </NavLink>

          <NavLink
          onClick={()=>(setIsOpen(false))}
            to="/dashboard/visitors"
            className="flex items-center space-x-3 p-3 hover:bg-[#2A4494] rounded-lg transition"
          >
            <FaChartBar />
            <span className={`${isOpen ? "block" : "hidden"} md:block`}>Visitors</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default DashboardNav;
