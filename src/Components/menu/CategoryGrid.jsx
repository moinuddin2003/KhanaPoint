import CategoryCard from "./CategoryCard";
import { useState, useEffect } from "react";
import { getMenuItems } from "../../services/restaurantAPI";
import { BASE_URL } from "../../services/authApi";
import { useNavigate } from "react-router";

function CategoryGrid() {
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getMenuItems();
        // Agar data backend se { data: [...] } structure mein aa raha hai toh usay handle karein
        const itemsList = Array.isArray(data) ? data : data?.data || [];
        setMenuItems(itemsList);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const validMenuItems = menuItems.filter((item) => item.category && item.restaurant);

  // Sirf unique categories nikalne ke liye
  const uniqueCategories = validMenuItems.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.category.id === item.category.id),
  );

  // 🔥 Helper function jo sahi se unique restaurant count nikalega
  const getUniqueRestaurantCount = (categoryId) => {
    const matchingRestaurants = validMenuItems
      .filter((item) => item.category.id === categoryId)
      .map((item) => item.restaurant.id);

    // Set duplicate IDs ko automatic remove kar deta hai
    const uniqueCount = new Set(matchingRestaurants).size;
    return `${uniqueCount} Restaurant${uniqueCount !== 1 ? "s" : ""}`;
  };

  return (
    <section className="px-6 py-8">
      <h2 className="text-2xl font-bold mb-4">
        Order.uk Popular Categories 🤩
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {uniqueCategories.map((menuItem) => (
          <CategoryCard
            key={menuItem.category.id}
            image={`${BASE_URL}${menuItem.image}`}
            name={menuItem.category.name}
            restaurantCount={getUniqueRestaurantCount(menuItem.category.id)}
            onClick={() => navigate(`/category/${menuItem.category.id}`)}
          />
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;