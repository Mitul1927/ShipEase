import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../reduxStore/authSlice2";
import { FaEye, FaEyeSlash, FaCloudUploadAlt, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password.includes(" ")) {
      setError("Password cannot contain spaces.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    if (image) formData.append("image", image);
    // console.log(formData);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await axios.post(`${backendUrl}/user/signup`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      
      navigate("/");
    } catch (err) {
      setError(err.response ? err.response.data.error : "Signup failed");
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken.image);
      dispatch(
        login({
          email: decodedToken.email,
          username: decodedToken.username,
          id: decodedToken.id,
          token,
          role: decodedToken.role,
          image: decodedToken.image,
        })
      );

      navigate("/");
    }
  }, [dispatch, navigate]);
  const handleGoogleLogin = () => {
    // console.log("button is clicked");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    toast.success("🎉 Signup Successful! Welcome to ShipEase!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    window.location.href = `${backendUrl}/auth/google`;
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#122C34]">
      <div className="bg-[#224870] p-8 rounded-xl shadow-xl w-96 text-white animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-6">Signup</h2>
        <form onSubmit={handleSignup} encType="multipart/form-data">
          <div className="mb-4">
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#44CFCB]"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#44CFCB]"
              required
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#44CFCB]"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-300 mb-2 text-center">
              Profile Picture
            </label>
            <div className="flex flex-col items-center">
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-[#4EA5D9] rounded-full hover:bg-[#2A4494] transition"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <FaCloudUploadAlt className="text-4xl mb-2" />
                    <span className="text-sm">Upload Image</span>
                  </div>
                )}
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg flex items-center gap-2 mt-3 mb-3 animate-fade-in">
              <span className="text-lg">⚠️</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="cursor-pointer w-full bg-[#4EA5D9] hover:bg-[#44CFCB] text-white p-3 rounded-lg font-semibold transition"
          >
            Signup
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-[#6ba6e6] hover:bg-[#4e6b89] text-white p-2 rounded cursor-pointer"
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
        </div>
        <div className="text-center text-gray-400 mt-4">
          <p>
            Already have an account?
            <span
              className="cursor-pointer text-blue-500 hover:text-blue-600"
              onClick={() => navigate("/Login")}
            >
              {" "}
              Login
            </span>
          </p>
          <p>
            Forgot Password?
            <span
              className="text-blue-500 cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/forgotPassword")}
            >
              {" "}
              Forgot Password
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
