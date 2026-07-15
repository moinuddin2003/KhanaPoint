// components/menu/DealsGrid.jsx
import { useState, useEffect } from "react";
import DealCard from "./DealCard";
import { BASE_URL } from "../../services/authApi";
import { getDealCategories, getDeals } from "../../services/restaurantAPI";

function DealsGrid() {
  const [activeTab, setActiveTab] = useState("all");
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsResponse, categoriesResponse] = await Promise.all([
          getDeals(),
          getDealCategories(),
        ]);

        // Bilkul safe tarike se data extract karna:
        // Agar response ke andar .data hai toh wo le, warna direct response ko use kare
        const rawDeals =
          dealsResponse?.data ||
          (Array.isArray(dealsResponse) ? dealsResponse : []);
        const rawCategories =
          categoriesResponse?.data ||
          (Array.isArray(categoriesResponse) ? categoriesResponse : []);

        setDeals(rawDeals);
        setCategories(rawCategories);
      } catch (error) {
        console.error("Data fetch karne mein masla hua:", error);
      }
    };

    fetchData();
  }, []);

  // Tabs ki list banana ("All" ko shuru mein add kar ke)
  const tabs = [{ id: "all", name: "All" }, ...categories];

  // Deals ko filter karne ki seedhi logic
  const filteredDeals =
    activeTab === "all"
      ? deals
      : deals.filter((deal) => {
          const firstItemCategoryId = deal?.items?.[0]?.menu_item?.category?.id;
          return firstItemCategoryId === Number(activeTab);
        });

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

      {filteredDeals.length === 0 ? (
        <p className="text-sm text-gray-500">
          No deals available for this category yet.
        </p>
      ) : (
        <>
          {/* Mobile: horizontal sliding row */}
          <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                image={`${BASE_URL}${deal.image}`}
                name={deal.name}
                restaurantLabel={
                  deal.items?.[0]?.menu_item?.restaurant?.name ||
                  "Unknown Restaurant"
                }
                discount={deal.combo_price}
                compact
              />
            ))}
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden lg:grid grid-cols-3 gap-5">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                image={`${BASE_URL}${deal.image}`}
                name={deal.name}
                restaurantLabel={
                  deal.items?.[0]?.menu_item?.restaurant?.name ||
                  "Unknown Restaurant"
                }
                discount={`$${deal.combo_price}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default DealsGrid;
