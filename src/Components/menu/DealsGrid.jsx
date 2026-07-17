// components/menu/DealsGrid.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DealCard from "./DealCard";
import { BASE_URL } from "../../services/authApi";
// Humne getDealItems (all-deal-item) ko bhi import kar liya
import {
  getDealCategories,
  getDeals,
  getDealItems,
} from "../../services/restaurantAPI";

function DealsGrid() {
  // <--- Yahan se 'onDealClick' prop hata diya
  const navigate = useNavigate(); // <--- Navigation hook lagaya
  const [activeTab, setActiveTab] = useState("all");
  const [deals, setDeals] = useState([]);
  const [dealItems, setDealItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Teenon APIs ko parallel call kar rahe hain
        const [dealsResponse, dealItemsResponse, categoriesResponse] =
          await Promise.all([getDeals(), getDealItems(), getDealCategories()]);

        const rawDeals =
          dealsResponse?.data ||
          (Array.isArray(dealsResponse) ? dealsResponse : []);
        const rawDealItems =
          dealItemsResponse?.data ||
          (Array.isArray(dealItemsResponse) ? dealItemsResponse : []);
        const rawCategories =
          categoriesResponse?.data ||
          (Array.isArray(categoriesResponse) ? categoriesResponse : []);

        setDeals(rawDeals);
        setDealItems(rawDealItems);
        setCategories(rawCategories);
      } catch (error) {
        console.error("Data fetch karne mein masla hua:", error);
      }
    };

    fetchData();
  }, []);

  const tabs = [{ id: "all", name: "All" }, ...categories];

  // ==========================================
  // RENDER LOGIC (Code saf aur readable rakhne ke liye)
  // ==========================================

  // 1. Render function jab "All" tab active ho (Pure Deal Cards show honge)
  const renderAllDeals = (isMobile = false) => {
    return deals.map((deal) => (
      <DealCard
        key={deal.id}
        image={`${BASE_URL}${deal.image}`}
        name={deal.name}
        restaurantLabel={
          deal.items?.[0]?.menu_item?.restaurant?.name || "Unknown Restaurant"
        }
        discount={`$${deal.combo_price}`}
        compact={isMobile}
        onClick={() => navigate(`/deal/${deal.id}`)} // <--- Navigation direct id ke sath!
      />
    ));
  };

  // 2. Render function - Category Items
  const renderCategoryItems = (isMobile = false) => {
    const filteredItems = dealItems.filter(
      (item) => item?.menu_item?.category?.id === Number(activeTab),
    );

    if (filteredItems.length === 0) {
      return (
        <p className="text-sm text-gray-500 py-4">
          No items available for this category yet.
        </p>
      );
    }

    return filteredItems.map((item) => (
      <DealCard
        key={item.id}
        image={`${BASE_URL}${item.menu_item.image}`}
        name={item.menu_item.name}
        restaurantLabel={
          item.menu_item.restaurant?.name || "Unknown Restaurant"
        }
        discount={`$${item.menu_item.price}`}
        compact={isMobile}
        onClick={() => navigate(`/deal/${item.deal_id}`)} // <--- Navigation jis deal ka part he uski id par!
      />
    ));
  };

  return (
    <section className="px-6 py-8">
      <div className="flex items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Up to -40% 🎊 Order.uk exclusive deals
        </h2>

        {/* Mobile: dropdown */}
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="lg:hidden ml-auto mb-4 border border-orange-500 rounded-full px-4 py-2 text-sm font-medium text-black bg-white"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.name}
            </option>
          ))}
        </select>

        {/* Desktop: scrollable tabs */}
        <nav className="hidden lg:flex overflow-x-auto scrollbar-hide gap-2 mb-4 ml-auto max-w-[60%] pb-1 scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base whitespace-nowrap cursor-pointer flex-shrink-0 ${
                activeTab === tab.id
                  ? "border border-orange-500 bg-white font-bold text-black"
                  : "border border-transparent font-medium text-gray-700 hover:bg-black/5 hover:text-black"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* RENDER BODY */}
      <div>
        {/* Mobile View: sliding row */}
        <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
          {activeTab === "all"
            ? renderAllDeals(true)
            : renderCategoryItems(true)}
        </div>

        {/* Desktop View: 3-column grid */}
        <div className="hidden lg:grid grid-cols-3 gap-5">
          {activeTab === "all"
            ? renderAllDeals(false)
            : renderCategoryItems(false)}
        </div>
      </div>
    </section>
  );
}

export default DealsGrid;
