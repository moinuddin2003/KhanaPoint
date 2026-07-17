// components/navbar/RestaurantDropdown.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronDown, Loader2 } from "lucide-react";
import { getRestaurants } from "../../services/restaurantAPI";

export default function RestaurantDropdown({ isMobile, closeMobileMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch restaurants when the dropdown opens
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!isOpen || restaurants.length > 0) return;

      setLoading(true);
      try {
        const data = await getRestaurants();
        setRestaurants(data || []);
      } catch (error) {
        console.error("Dropdown loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [isOpen, restaurants.length]);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shared status component to clean up loader/empty states
  const DropdownStatus = ({ isCentered }) => {
    if (loading) {
      return (
        <div
          className={`flex items-center gap-2 text-xs text-gray-500 ${isCentered ? "justify-center py-4" : "py-1"}`}
        >
          <Loader2 size={16} className="animate-spin text-[#FC8A06]" />{" "}
          Loading...
        </div>
      );
    }
    if (restaurants.length === 0) {
      return (
        <div
          className={`text-xs text-gray-400 py-1 ${isCentered ? "text-center py-3" : ""}`}
        >
          No restaurants found
        </div>
      );
    }
    return null;
  };

  if (isMobile) {
    return (
      <MobileDropdown
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        restaurants={restaurants}
        closeMobileMenu={closeMobileMenu}
        statusComponent={<DropdownStatus isCentered={false} />}
      />
    );
  }

  return (
    <DesktopDropdown
      dropdownRef={dropdownRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      restaurants={restaurants}
      statusComponent={<DropdownStatus isCentered={true} />}
    />
  );
}

// --- Sub-components for better readability ---

function MobileDropdown({
  isOpen,
  setIsOpen,
  restaurants,
  closeMobileMenu,
  statusComponent,
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-brand-dark font-medium hover:text-[#FC8A06] text-left flex items-center justify-between w-full"
      >
        <span>Restaurants</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="pl-4 flex flex-col gap-2 max-h-48 overflow-y-auto border-l-2 border-gray-100 mt-1">
          {restaurants.length === 0
            ? statusComponent
            : restaurants.map((res) => (
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
              ))}
        </div>
      )}
    </div>
  );
}

function DesktopDropdown({
  dropdownRef,
  isOpen,
  setIsOpen,
  restaurants,
  statusComponent,
}) {
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-brand-dark hover:text-[#FC8A06] transition-colors duration-200 font-semibold flex items-center gap-1 cursor-pointer"
      >
        <span>Restaurants</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white border border-black/10 rounded-xl shadow-lg z-50 py-2 max-h-60 overflow-y-auto">
          {restaurants.length === 0
            ? statusComponent
            : restaurants.map((res) => (
                <Link
                  key={res.id}
                  to={`/restaurants/${res.id}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FC8A06] transition-colors"
                >
                  {res.name}
                </Link>
              ))}
        </div>
      )}
    </div>
  );
}
