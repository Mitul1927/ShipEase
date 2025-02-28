import React, { useEffect } from "react";

const Footer = () => {

  return (
    <footer className="bg-[#122C34] text-[#4EA5D9] py-6 px-8 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start">

        <div className="md:w-1/2 text-center md:text-left md:relative md:right-30">
          <img src="/logo.jpg" alt="Logo" className="h-10 mx-auto md:mx-0" />
          <p className="text-sm text-gray-400 mt-2 max-w-sm">
            Track your shipments seamlessly with our real-time cargo tracking system.
          </p>
        </div>


        <div className="md:w-1/2 text-center md:text-right mt-4 md:mt-0">
          <p className="text-sm text-gray-400">Contact: shipease@gmail.com</p>
          <div className="flex justify-center md:justify-end space-x-4 mt-2">
            <a href="#" className="hover:text-[#44CFCB]">Facebook</a>
            <a href="#" className="hover:text-[#44CFCB]">Twitter</a>
            <a href="#" className="hover:text-[#44CFCB]">LinkedIn</a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-600 mt-6 pt-4 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} Cargo Tracker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
