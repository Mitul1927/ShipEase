import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../reduxStore/authSlice2";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
const Login = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setshowPassword] = useState("false");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // console.log("email->",email,"password->",password);
      const res = await axios.post(
        `${backendUrl}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      // console.log(res);
      const token = res.data.token;
      localStorage.setItem("token", token);
      toast.success("🎉 Signup Successful! Welcome to ShipEase!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      // console.log(decodedToken);
      Navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("Invalid credentials");
      }
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      Navigate("/");
    }
  }, [dispatch, Navigate]);
  const handleGoogleLogin = () => {
    console.log("button is clicked", backendUrl);
    window.location.href = `${backendUrl}/auth/google`;
  };
  return (
    <div className="flex justify-center items-center h-screen bg-[#122C34]">
      <div className="bg-[#224870] p-8 rounded-lg shadow-lg w-96 text-white animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 rounded border ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 rounded border ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setshowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleLogin}
            type="submit"
            className="w-full bg-[#4EA5D9] hover:bg-[#44CFCB] text-white p-2 rounded cursor-pointer"
          >
            Login
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-[#4c64ac] hover:bg-[#343c52] text-white p-2 rounded cursor-pointer"
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
        </div>
        <div>
          <p className="text-center text-gray-400 mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:text-blue-600"
              onClick={() => Navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
          <p className="text-center text-gray-400">
            Forgot Password?{" "}
            <span
              className="text-blue-500 hover:text-blue-600 cursor-pointer"
              onClick={() => Navigate("/forgotpassword")}
            >
              Reset Password
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
