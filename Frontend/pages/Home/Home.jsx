import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {login } from "../../reduxStore/authSlice2";
import {jwtDecode} from "jwt-decode";
import 'leaflet/dist/leaflet.css';

const Home = () => {
  const Navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const Dispatch  = useDispatch();
  const handleAddShipment = () => {
    if (isAuthenticated) {
      Navigate('/addShipment');
    } else {
      Navigate('/signup');
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      Dispatch(login({ email: decoded.email, token : decoded.token,role : decoded.role }));
    }
  }, [Dispatch]);



  const shipments = [
    { id: 1, location: [28.6139, 77.2090], name: 'New Delhi, India' },
    { id: 2, location: [40.7128, -74.0060], name: 'New York, USA' },
    { id: 3, location: [51.5074, -0.1278], name: 'London, UK' },
  ];

  return (
    <div className="h-screen w-full bg-[#122C34] flex items-center justify-between px-12">
      <div className="text-white w-1/2">
        <h1 className="text-5xl font-bold text-[#44CFCB]">
          Track Your Cargo in Real-Time
        </h1>
        <p className="text-lg text-[#4EA5D9] mt-4">
          "Your shipments, delivered with precision and speed."
        </p>
        <button
          className="cursor-pointer mt-6 px-6 py-3 bg-[#4EA5D9] hover:bg-[#44CFCB] text-white rounded-lg shadow-lg transition-all duration-300"
          onClick={handleAddShipment}
        >
          Add Shipment
        </button>
      </div>
      <div className="w-1/2 h-[400px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={[20, 0]} zoom={2} className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {shipments.map((shipment) => (
            <Marker key={shipment.id} position={shipment.location}>
              <Popup>{shipment.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Home;
