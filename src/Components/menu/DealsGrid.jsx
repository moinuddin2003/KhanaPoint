// components/menu/DealsGrid.jsx
import { useState, useEffect } from "react";
import DealCard from "./DealCard";
import { BASE_URL } from "../../services/authApi";
import { getDealCategories, getDeals } from "../../services/restaurantAPI";

const getDealCategoryName = (deal) => {
  const candidates = [
    deal?.category?.name,
    deal?.category_name,
    deal?.category?.title,
    deal?.items?.[0]?.menu_item?.category?.name,
    deal?.items?.[0]?.menu_item?.category_name,
  ];

  return candidates.find((value) => Boolean(value));
};

const getDealCategoryId = (deal) => {
  const candidates = [
    deal?.category?.id,
    deal?.category_id,
    deal?.items?.[0]?.menu_item?.category?.id,
  ];

  return candidates.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
};

function DealsGrid() {
  const [activeTab, setActiveTab] = useState("all");
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const [dealsData, categoriesData] = await Promise.all([
          getDeals(),
          getDealCategories(),
        ]);

        const normalizedDeals = Array.isArray(dealsData) ? dealsData : [];
        setDeals(normalizedDeals);

        const normalizedCategories = (
          Array.isArray(categoriesData) ? categoriesData : []
        )
          .map((category) => ({
            id: category.id ?? category.slug ?? category.name,
            name:
              category.name ??
              category.title ??
              category.category_name ??
              "Unknown",
          }))
          .filter((category) => category.name);

        if (normalizedCategories.length > 0) {
          setCategories(normalizedCategories);
        } else {
          const derivedCategories = normalizedDeals
            .map((deal) => ({
              id: getDealCategoryId(deal),
              name: getDealCategoryName(deal),
            }))
            .filter((category) => category.name)
            .filter(
              (category, index, self) =>
                index === self.findIndex((item) => item.name === category.name),
            );

          setCategories(derivedCategories);
        }
      } catch (error) {
        console.error(error);
        setDeals([]);
        setCategories([]);
      }
    };

    fetchDeals();
  }, []);

  const tabs = [{ id: "all", name: "All" }, ...categories];
  const filteredDeals =
    activeTab === "all"
      ? deals
      : deals.filter((deal) => {
          const currentCategoryId = getDealCategoryId(deal);
          const currentCategoryName = getDealCategoryName(deal);
          const selectedCategory = categories.find(
            (category) => category.id === activeTab,
          );

          return (
            currentCategoryId === activeTab ||
            currentCategoryName === selectedCategory?.name
          );
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

        <nav className="hidden lg:flex overflow-x-auto scrollbar-hide gap-2 mb-4 ml-auto max-w-[60%] pb-1 scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-2 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base whitespace-nowrap cursor-pointer ${
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
