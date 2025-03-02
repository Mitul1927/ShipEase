import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bookmark,BookmarkCheck, Calendar, MapPin, User } from "lucide-react";

const MyShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByEta, setSortByEta] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [bookmarkedShipments, setBookmarkedShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/myShipments`,
          { headers: { Authorization: token } }
        );
        setShipments(response.data);
      } catch (error) {
        console.error("Error fetching user shipments", error);
      }
    };
    fetchShipments();
  }, []);

  const handleBookmarkToggle = (e, shipmentId) => {
    e.preventDefault();
    e.stopPropagation();

    setBookmarkedShipments((prev) =>
      prev.includes(shipmentId)
        ? prev.filter((id) => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  const filteredShipments = shipments
    .filter((shipment) =>
      shipment.containerId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((shipment) =>
      statusFilter === "All" ? true : shipment.status === statusFilter
    )
    .sort((a, b) => (sortByEta ? new Date(a.eta) - new Date(b.eta) : 0));

  return (
    <div className="min-h-screen bg-[#122C34] text-white p-6 md:p-10">
      <h2 className="text-3xl font-bold mb-6 text-center">My Shipments</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Container ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white w-full md:w-1/2"
        />
        <select
          className="p-2 rounded bg-gray-800 text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => setSortByEta(!sortByEta)}
          className="bg-[#4EA5D9] px-4 py-2 rounded text-black font-bold"
        >
          Sort by ETA {sortByEta ? "▲" : "▼"}
        </button>
      </div>

      {filteredShipments.length === 0 ? (
        <div>No shipments... </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShipments.map((shipment) => (
            <Link
              to={`/shipment/${shipment._id}`}
              key={shipment._id}
              className="bg-[#224870] p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <MapPin className="text-[#44CFCB]" /> {shipment.containerId}
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-300">
                <User className="text-[#4EA5D9]" /> Owner: {shipment.owner}
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-300">
                <Calendar className="text-[#4EA5D9]" /> ETA:{" "}
                {new Date(shipment.eta).toLocaleString()}
              </div>
              <div className="border-l-4 border-[#44CFCB] pl-3 my-3">
                <p className="text-md text-gray-300">
                  From: {shipment.route[0]?.placeName || "Unknown"}
                </p>
                <p className="text-md text-gray-300">
                  To:{" "}
                  {shipment.route[shipment.route.length - 1]?.placeName ||
                    "Unknown"}
                </p>
              </div>
              <div className="mb-2 text-gray-300">
                Current Location:{" "}
                {shipment.currentLocation?.placeName || "Unknown"}
              </div>
              <div className="mb-3">
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                    shipment.status === "Pending"
                      ? "bg-yellow-500"
                      : shipment.status === "In Transit"
                      ? "bg-blue-500"
                      : shipment.status === "Delivered"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {shipment.status}
                </span>
              </div>
              <button
                className="flex cursor-pointer items-center gap-2 text-[#44CFCB] hover:text-[#4EA5D9]"
                onClick={(e) => handleBookmarkToggle(e, shipment._id)}
              >
                {bookmarkedShipments.includes(shipment._id) ? (
                <BookmarkCheck className="text-yellow-400" />
              ) : (
                <Bookmark />
              )}
                {bookmarkedShipments.includes(shipment._id) ? "Bookmarked" : "Bookmark"}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyShipments;
