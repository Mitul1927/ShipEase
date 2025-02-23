import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { login } from "../../reduxStore/authSlice2";
import { jwtDecode } from "jwt-decode";
import "leaflet/dist/leaflet.css";

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAddShipment = () => {
    if (isAuthenticated) {
      navigate("/addShipment");
    } else {
      navigate("/signup");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(
        login({
          email: decoded.email,
          id: decoded.id,
          token: decoded.token,
          role: decoded.role,
        })
      );
    }
  }, [dispatch]);

  const shipments = [
    { id: 1, location: [28.6139, 77.209], name: "New Delhi, India" },
    { id: 2, location: [40.7128, -74.006], name: "New York, USA" },
    { id: 3, location: [51.5074, -0.1278], name: "London, UK" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#122C34] flex flex-col md:flex-row items-center justify-center px-6 md:px-12 py-10 space-y-6 md:space-y-0 md:space-x-12">
      <div className="text-white w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-[#44CFCB]">
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
      <div className="w-full md:w-1/2 h-80 md:h-[400px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={[20, 0]} zoom={2} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
