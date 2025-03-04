import React, { useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

const UpdateMapCenter = ({ mapCenter }) => {
  const map = useMap();
  map.setView(mapCenter, 10);
  return null;
};

const SearchLocation = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  setMapCenter,
}) => {
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleSelectLocation = (lat, lon) => {
    setMapCenter([lat, lon]);
    setSearchResults([]);
    // setSearchQuery("");
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 md:p-3 rounded bg-gray-800 text-white"
        placeholder="Enter location"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="absolute right-2 top-1 md:top-2 bg-[#4EA5D9] text-white px-3 py-1 rounded"
      >
        Search
      </button>
      {searchResults.length > 0 && (
        <ul className="absolute bg-white text-black w-full mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
          {searchResults.map((result, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectLocation(result.lat, result.lon)}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AddShipment = () => {
  const [containerId, setContainerId] = useState("");
  const [eta, setEta] = useState("");
  const [status, setStatus] = useState("Pending");
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 78]);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

  const customMarkerIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // const handleMapClick = async (e) => {
  //   const { lat, lng } = e.latlng;
  //   try {
  //     const response = await axios.get(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  //     );
  //     const placeName = response.data.display_name || "Unknown Location";

  //     const newPoint = { lat, lng, placeName };
  //     setMapCenter([lat, lng]);

  //     if (!currentLocation) {
  //       setCurrentLocation(newPoint);
  //     }

  //     setRoute([...route, newPoint]);
  //   } catch (error) {
  //     console.error("Error fetching place name:", error);
  //   }
  // };
  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
  
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (response.data.error === "Unable to geocode") {
        const res = prompt(
          "Are shipments delivered on oceans? (Yes/No)\nIf Yes, please tell us your name."
        );
  
        if (res && res.toLowerCase() !== "no") {
          alert(`Have some sense, ${res}! 😂`);
        } else {
          alert("Good! You know shipments can't be delivered in the ocean. 🏝️");
        }
        return;
      }
      const placeName = response.data.display_name || "Unknown Location";
  
      const newPoint = { lat, lng, placeName };
      setMapCenter([lat, lng]);
  
      if (!currentLocation) {
        setCurrentLocation(newPoint);
      }
  
      setRoute([...route, newPoint]);
    } catch (error) {
      console.error("Error fetching place name:", error);
    }
  };
  

  const handleRemoveMarker = (index) => {
    const newRoute = route.filter((_, i) => i !== index);
    setRoute(newRoute);
  };

  const handleRemoveAllMarkers = (e) => {
    e.stopPropagation();
    setRoute([]);
    setCurrentLocation(null);
  };
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const userId = decodedToken.id;

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    const shipmentData = {
      userId: userId,
      containerId,
      route,
      currentLocation: currentLocation || route[0],
      eta,
      status,
    };
    // console.log(shipmentData);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/shipment/addShipment`,
        shipmentData,
        { headers: { Authorization: token } }
      );
      console.log(shipmentData);
      alert("Shipment added successfully");
      // Navigate("/allShipments");
    } catch (err) {
      console.error("Error adding shipment", err);
      setError(err.response.data.msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#122C34] text-white flex flex-col items-center p-4 md:p-10">
      <h2 className="text-2xl md:text-3xl mb-4 md:mb-6 font-bold text-center">
        Add Shipment
      </h2>
      <p className="mb-2 md:mb-4 text-gray-300 text-center max-w-lg">
        Click on the map to mark your shipment route. The first click sets the
        starting point, and each subsequent click adds a waypoint. Click a
        marker to remove it.
      </p>

      <div className="bg-[#224870] p-4 md:p-8 rounded-lg shadow-lg w-full max-w-3xl relative">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block mb-1 md:mb-2 font-semibold">
              Container ID
            </label>
            <input
              type="text"
              value={containerId}
              onChange={(e) => setContainerId(e.target.value)}
              className="w-full p-2 md:p-3 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 md:mb-2 font-semibold">
              Estimated Time of Arrival
            </label>
            <input
              type="datetime-local"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              className="w-full p-2 md:p-3 rounded bg-gray-800 text-white"
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
          <div>
            {/* <label className="block mb-1 md:mb-2 font-semibold">
              Shipment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 md:p-3 rounded bg-gray-800 text-white"
            >
              <option>Pending</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select> */}
          </div>

          <SearchLocation
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            setMapCenter={setMapCenter}
          />

          <div className="block h-64 md:h-96 rounded overflow-hidden mt-32">
            <MapContainer
              center={mapCenter}
              zoom={5}
              className="h-full w-full rounded"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              />
              <UpdateMapCenter mapCenter={mapCenter} />
              <MapClickHandler onClick={handleMapClick} />
              {route.map((point, index) => (
                <Marker
                  key={index}
                  position={[point.lat, point.lng]}
                  icon={customMarkerIcon}
                  eventHandlers={{ click: () => handleRemoveMarker(index) }}
                />
              ))}
              {route.length > 1 && (
                <Polyline
                  positions={route.map((p) => [p.lat, p.lng])}
                  color="#44CFCB"
                />
              )}
            </MapContainer>
          </div>
          {error && (
            <p className="text-red-500 text-lg items-center mb-2">{error}</p>
          )}
          <button
            type="button"
            onClick={handleRemoveAllMarkers}
            className="w-full bg-red-500 p-2 md:p-3 rounded text-white font-bold mt-2 md:mt-4"
          >
            Clear All Markers
          </button>

          <button
            type="submit"
            className="w-full bg-[#44CFCB] p-2 md:p-3 rounded text-black font-bold"
          >
            Add Shipment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShipment;
