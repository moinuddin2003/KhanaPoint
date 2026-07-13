import CategoryCard from "./CategoryCard";
import { useState, useEffect } from "react";
import { getMenuItems } from "../../services/restaurantAPI";
import { BASE_URL } from "../../services/authApi";
import { useNavigate } from "react-router";

// const categoriesData = [
//   { id: 1, image: "/src/assets/category1.png", name: "Category 1", restaurantCount: "5 Restaurants" },
//   { id: 2, image: "/src/assets/category2.png", name: "Category 2", restaurantCount: "12 Restaurants" },
//   { id: 3, image: "/src/assets/category3.png", name: "Category 3", restaurantCount: "8 Restaurants" },
//   { id: 4, image: "/src/assets/category4.png", name: "Category 1", restaurantCount: "5 Restaurants" },
//   { id: 5, image: "/src/assets/category5.png", name: "Category 2", restaurantCount: "12 Restaurants" },
//   { id: 6, image: "/src/assets/category6.png", name: "Category 3", restaurantCount: "8 Restaurants" },
// ];

function CategoryGrid() {
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getMenuItems();
        // console.log(Array.isArray(data)); // true or false
        console.log(data);
        setMenuItems(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMenuItems();
  }, []);

  const validMenuItems = menuItems.filter((item) => item.category);

  const uniqueCategories = validMenuItems.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.category.id === item.category.id),
  );

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
            restaurantCount={`${validMenuItems.filter((item) => item.category.id === menuItem.category.id).length} Restaurants`}
            onClick={() => navigate(`/category/${menuItem.category.id}`)}
          />
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
