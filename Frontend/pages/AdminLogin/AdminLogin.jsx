import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../reduxStore/authSlice2';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
const AdminLogin = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[error,setError] = useState('');
  const [showPassword,setshowPassword] = useState('false');
  const handleLogin = async(e) =>{
    e.preventDefault();
    setError("");
    try{
      const res = await axios.post('http://localhost:3000/user/login',{email,password});
      const token  = res.data.token;
      localStorage.setItem("token",token);
      
      const decodedToken = jwtDecode(token);
      dispatch(login({token : res.data.token,email : decodedToken.email,id : decodedToken.id,role : decodedToken.role}))
      Navigate('/');
    }catch(err){
      if(err.response){
        setError(err.response.data.error);
      }else{
        setError("Invalid credentials");
      }
    }
  }
  return (
    <div className="flex justify-center items-center h-screen bg-[#122C34]">
      <div className="bg-[#224870] p-8 rounded-lg shadow-lg w-96 text-white animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 rounded border ${error ? "border-red-500" : "border-gray-300"}`}
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 rounded border ${error ? "border-red-500" : "border-gray-300"}`}
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
          <button onClick={handleLogin} type="submit" className="w-full bg-[#4EA5D9] hover:bg-[#44CFCB] text-white p-2 rounded cursor-pointer">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
