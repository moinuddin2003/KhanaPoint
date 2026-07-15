// components/navbar/RestaurantDropdown.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronDown, Loader2 } from "lucide-react";

export default function RestaurantDropdown({ isMobile, closeMobileMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // API se restaurants vanilla fetch ke zariye mangwana
  useEffect(() => {
    if (isOpen && restaurants.length === 0) {
      setLoading(true);
      fetch("http://127.0.0.1:8000/restaurants/all-restaurant")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response sahi nahi tha");
          }
          return res.json();
        })
        .then((resData) => {
          setRestaurants(resData?.data || []);
        })
        .catch((err) => console.error("Restaurants load nahi huay:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, restaurants.length]);

  // Bahar click karne par dropdown band karne ki logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-brand-dark font-medium hover:text-[#FC8A06] text-left flex items-center justify-between w-full"
        >
          <span>Restaurants</span>
          <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        
        {isOpen && (
          <div className="pl-4 flex flex-col gap-2 max-h-48 overflow-y-auto border-l-2 border-gray-100 mt-1">
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 py-1">
                <Loader2 size={14} className="animate-spin" /> Loading...
              </div>
            ) : restaurants.length === 0 ? (
              <span className="text-xs text-gray-400 py-1">No restaurants found</span>
            ) : (
              restaurants.map((res) => (
                <Link
                  key={res.id}
                  to={`/restaurants/${res.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    closeMobileMenu();
                  }}
                  className="text-sm text-gray-600 hover:text-[#FC8A06] py-1"
                >
                  {res.name}
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-brand-dark hover:text-[#FC8A06] transition-colors duration-200 font-semibold flex items-center gap-1 cursor-pointer"
      >
        <span>Restaurants</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white border border-black/10 rounded-xl shadow-lg z-50 py-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 py-4">
              <Loader2 size={16} className="animate-spin text-[#FC8A06]" /> Loading...
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-xs text-gray-400 text-center py-3">No restaurants found</div>
          ) : (
            restaurants.map((res) => (
              <Link
                key={res.id}
                to={`/restaurants/${res.id}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FC8A06] transition-colors"
              >
                {res.name}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}