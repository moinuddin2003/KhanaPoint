import RestaurantCard from "./RestaurantCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // 1. useNavigate import kiya
import { getRestaurants } from "../../services/restaurantAPI";
import { BASE_URL } from "../../services/authApi";

function RestaurantGrid({ type }) {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // 2. Navigate function initialize kiya

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <section className="px-6 py-8">
      <h2 className="text-2xl font-bold mb-4">{type} Restaurants</h2>

      {/* Mobile: sliding row */}
      <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {restaurants.map((r) => (
          <div key={r.id} className="flex-shrink-0 w-[160px] snap-start">
            {/* 3. onClick handler pass kiya jo card ke button pe chalega */}
            <RestaurantCard
              {...r}
              image={`${BASE_URL}${r.image}`}
              onClick={() => navigate(`/restaurants/${r.id}`)}
            />
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden lg:grid grid-cols-6 gap-5">
        {restaurants.map((r) => (
          /* 4. Same onClick yahan bhi lagaya */
          <RestaurantCard
            key={r.id}
            {...r}
            image={`${BASE_URL}${r.image}`}
            onClick={() => navigate(`/restaurants/${r.id}`)}
          />
        ))}
      </div>
    </section>
  );
}

export default RestaurantGrid;
