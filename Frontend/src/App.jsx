import { useState } from 'react'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  // const id = useSelector(state=>state.auth.userId);
  // console.log(id);
  
  return (
    <div className='m-0'>
      
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <Outlet/>
      <Footer />
    </div>
  )
}

export default App
