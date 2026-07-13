// components/menu/DealsGrid.jsx
import { useState, useEffect } from "react";
import DealCard from "./dealCard";
import {} from "../../services/restaurantAPI";
import { BASE_URL } from "../../services/authApi";
import { getDeals } from "../../services/restaurantAPI";

const tabs = ["Vegan", "Sushi", "Pizza & Fast Food", "Others"];

const deals = [
  {
    id: 1,
    image: "/src/assets/deal1.png",
    name: "Deal 1",
    restaurantLabel: "Restaurant A",
    discount: "-20%",
  },
  {
    id: 2,
    image: "/src/assets/deal2.png",
    name: "Deal 2",
    restaurantLabel: "Restaurant B",
    discount: "-40%",
  },
  {
    id: 3,
    image: "/src/assets/deal3.png",
    name: "Deal 3",
    restaurantLabel: "Restaurant C",
    discount: "-17%",
  },
];

function DealsGrid() {
  const [activeTab, setActiveTab] = useState(0);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await getDeals();
        // console.log(Array.isArray(data)); // true or false
        console.log(data);
        setDeals(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDeals();
  }, []);

  console.log(deals);
  return (
    <section className="px-6 py-8">
      <div className="flex items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Up to -40% 🎊 Order.uk exclusive deals
        </h2>

        {/* Mobile: dropdown */}
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(Number(e.target.value))}
          className="lg:hidden ml-auto mb-4 border border-orange-500 rounded-full px-4 py-2 text-sm font-medium text-black bg-white"
        >
          {tabs.map((tab, index) => (
            <option key={tab} value={index}>
              {tab}
            </option>
          ))}
        </select>

        <nav className="hidden lg:flex flex-wrap justify-end gap-1 mb-4 ml-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-4 sm:px-6 py-2 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base whitespace-nowrap cursor-pointer ${
                activeTab === index
                  ? "border border-orange-500 bg-white font-bold text-black"
                  : "border border-transparent font-medium text-gray-700 hover:bg-black/5 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile: horizontal sliding row */}
      <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {deals.map((deal) => (
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
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            image={`${BASE_URL}${deal.image}`}
            name={deal.name}
            restaurantLabel={
              deal.items?.[0]?.menu_item?.restaurant?.name ||
              "Unknown Restaurant"
            }
            discount={`\$${deal.combo_price}`}
          />
        ))}
      </div>
    </section>
  );
}

export default DealsGrid;
