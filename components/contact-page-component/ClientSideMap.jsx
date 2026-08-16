"use client";
import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";

const ClientSideMap = ({ position, setPosition, officeAddress }) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let map;
    let marker;
    let L;

    const addLeafletCss = () => {
      if (document.querySelector("#leaflet-css")) return;
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    };

    const init = async () => {
      addLeafletCss();
      L = (await import("leaflet")).default;

      // Fix marker icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(mapRef.current, { scrollWheelZoom: true }).setView(
        position,
        16,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      marker = L.marker(position).addTo(map);
      marker.bindPopup(
        `<div class="font-medium"><h3 style="color:#00f0ff;font-weight:700;margin-bottom:4px;">Our Office</h3><p style="color:#333">${officeAddress}</p></div>`,
      );

      leafletMapRef.current = map;
    };

    init();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isClient]);

  // handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector("input");
    const searchQuery = input.value;
    if (!searchQuery) return;

    const { OpenStreetMapProvider } = await import("leaflet-geosearch");
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results.length > 0) {
      const { x: lng, y: lat } = results[0];
      setPosition([lat, lng]);
      const map = leafletMapRef.current;
      if (map) map.flyTo([lat, lng], 16);
    }
  };

  if (!isClient) {
    return (
      <div className="h-96 w-full bg-[#0e0e15] flex items-center justify-center rounded-lg">
        <p className="text-[#b0b0ff]">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full relative rounded-lg overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute top-4 right-4">
        <div className="p-2 bg-white rounded-lg shadow-lg border border-[#00f0ff]/20">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search location..."
              className="px-3 py-1 w-48 bg-white border-1 text-black rounded-l focus:outline-none focus:ring-2 focus:ring-[#00f0ff] placeholder-[#b0b0ff]/50"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white px-4 py-2 rounded-r hover:opacity-90 transition-all"
            >
              <FiSearch />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientSideMap;
