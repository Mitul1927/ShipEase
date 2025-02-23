import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import {login } from "../reduxStore/authSlice2"
import {jwtDecode} from "jwt-decode";
import { useDispatch } from 'react-redux';


const Footer = () => {
  const Dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      // console.log(decoded);
      Dispatch(login({ email: decoded.email,id:decoded.id, token : decoded.token,role : decoded.role }));
    }
  }, [Dispatch])
  return (
    <footer className="bg-[#122C34] text-[#4EA5D9] py-6 px-8 md:px-16 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
        

        <div className="flex flex-col items-center md:items-start">
          <img src="/vite.svg" alt="Logo" className="h-10" />
          <p className="text-sm text-gray-400 mt-2 max-w-sm">
            Track your shipments seamlessly with our real-time cargo tracking system.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <p className="text-sm text-gray-400">Contact: shipease@gmail.com</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-[#44CFCB]">Facebook</a>
            <a href="#" className="hover:text-[#44CFCB]">Twitter</a>
            <a href="#" className="hover:text-[#44CFCB]">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-600 mt-6 pt-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Cargo Tracker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


/*
import React from 'react'
import { useEffect } from 'react';
import {login } from "../reduxStore/authSlice2"
import {jwtDecode} from "jwt-decode";
import { useDispatch } from 'react-redux';
const Dispatch = useDispatch();
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        // console.log(decoded);
        Dispatch(login({ email: decoded.email,id:decoded.id, token : decoded.token,role : decoded.role }));
      }
    }, [Dispatch]);*/