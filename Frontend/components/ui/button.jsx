import React from "react";

const Button = ({ children, onClick, type = "button", variant = "primary", isLoading = false }) => {
  const baseStyles = "px-5 py-2 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md cursor-pointer",
    secondary: "bg-gray-600 hover:bg-gray-700 active:scale-95 shadow-md cursor-pointer",
    danger: "bg-red-600 hover:bg-red-700 active:scale-95 shadow-md cursor-pointer",
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
