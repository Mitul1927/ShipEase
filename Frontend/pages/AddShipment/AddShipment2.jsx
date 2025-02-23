import React, { useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

const AddShipment = () => {
  const [containerId, setContainerId] = useState("");
  const [eta, setEta] = useState("");
  const [status, setStatus] = useState("Pending");
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const customMarkerIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    if (!currentLocation) {
      setCurrentLocation({ lat, lng });
    }
    setRoute([...route, { lat, lng }]);
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

  const handleSearch = async () => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    setSearchResults(results);
  };

  const handleSelectLocation = (lat, lng) => {
    setRoute([...route, { lat, lng }]);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shipmentData = {
      userId: "USER_ID_HERE", // Replace with actual user ID
      shipmentId: `SHIP-${Date.now()}`,
      containerId,
      route,
      currentLocation: currentLocation || route[0],
      eta,
      status,
    };
    try {
      await axios.post("http://localhost:3000/shipment", shipmentData);
      alert("Shipment added successfully");
    } catch (err) {
      console.error("Error adding shipment", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#122C34] text-white flex flex-col items-center p-4 md:p-10">
      <h2 className="text-2xl md:text-3xl mb-4 md:mb-6 font-bold text-center">
        Add Shipment
      </h2>
      <p className="mb-2 md:mb-4 text-gray-300 text-center max-w-lg">
        Click on the map to mark your shipment route. The first click sets the
        starting point, and each subsequent click adds a waypoint.
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
              required
            />
          </div>
          <div>
            <label className="block mb-1 md:mb-2 font-semibold">
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
            </select>
          </div>
          <div className=" relative flex justify-between">
            <div>
              <label className="block mb-2 font-semibold">
                Select Route on Map
              </label>
              <p className=" text-gray-300 text-sm mb-2 hidden md:block ">
                Click on the map to add route points. Click on a marker to
                remove it.
              </p>
            </div>
            <div>
              <button
                onClick={handleRemoveAllMarkers}
                type="button"
                className="cursor-pointer absolute md:top-5 right-2 bg-red-500  text-white px-3 py-1 rounded z-10"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded overflow-hidden mt-4">
            <MapContainer
              center={[20, 78]}
              zoom={5}
              className="h-full w-full rounded"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
          <button
            type="submit"
            className="w-full bg-[#44CFCB] p-2 md:p-3 rounded text-black font-bold mt-2 md:mt-4"
          >
            Add Shipment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShipment;
