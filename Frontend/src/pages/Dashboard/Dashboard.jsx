import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import DashboardNav from "./Dashboardnav";
import { Outlet } from "react-router-dom";
import { FaBars, FaUser, FaTruck, FaChartBar, FaTimes } from "react-icons/fa";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const Dashboard = () => {
  const username = useSelector((state) => state.auth.username);
  const email = useSelector((state) => state.auth.email);
  const image = useSelector((state) => state.auth.image);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen  bg-[#122C34] text-white p-4">
      <DashboardNav />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
