import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, MapPin, Calendar, User } from "lucide-react";

const AllShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [bookmarked, setBookmarked] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByEta, setSortByEta] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/shipment/allShipments`
        );
        setShipments(response.data);
      } catch (error) {
        console.error("Error fetching shipments", error);
      }
    };
    fetchShipments();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarked((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      return newBookmarks;
    });
  };

  const filteredShipments = shipments
    .filter((shipment) =>
      shipment.containerId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {if (!sortByEta) return 0; 
      return new Date(a.eta) - new Date(b.eta);});

  return (
    <div className="min-h-screen bg-[#122C34] text-white p-6 md:p-10">
      <h2 className="text-3xl font-bold mb-6 text-center">All Shipments</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Container ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white w-full md:w-1/2"
        />
        <button
          onClick={() => setSortByEta(!sortByEta)}
          className="bg-[#4EA5D9] px-4 py-2 rounded text-black font-bold"
        >
          Sort by ETA {sortByEta ? "▲" : "▼"}
        </button>
      </div>

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
              <Calendar className="text-[#4EA5D9]" /> ETA: {new Date(shipment.eta).toLocaleString()}
            </div>
            <div className="border-l-4 border-[#44CFCB] pl-3 my-3">
              <p className="text-md text-gray-300">From: {shipment.route[0]?.placeName || "Unknown"}</p>
              <p className="text-md text-gray-300">To: {shipment.route[shipment.route.length - 1]?.placeName || "Unknown"}</p>
            </div>
            <div className="mb-2 text-gray-300">Current Location: {shipment.currentLocation?.placeName || "Unknown"}</div>
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
              className="cursor-pointer flex items-center gap-2 text-[#44CFCB] hover:text-[#4EA5D9]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(shipment._id);
              }}
            >
              {bookmarked.has(shipment._id) ? (
                <BookmarkCheck className="text-yellow-400" />
              ) : (
                <Bookmark />
              )}
              {bookmarked.has(shipment._id) ? "Bookmarked" : "Bookmark"}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllShipments;
