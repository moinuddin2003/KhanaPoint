import React, { useEffect, useState } from "react";
import { useParams } from "react-router"; // URL se dynamic ID nikalne ke liye

import Card from "../../Components/RestaurantDetail/Card";
import DiscountCards from "../../Components/RestaurantDetail/DiscountCards";
import RestaurantGrid from "../../Components/menu/RestaurantGrid";
import RestaurantHero from "../../Components/RestaurantDetail/RestaurantHero";
import RestaurantOffersHeader from "../../Components/RestaurantDetail/RestaurantOffersHeader";
import OfferCategoryTabs from "../../Components/RestaurantDetail/OfferCategoryTabs";
import Location from "../../Components/RestaurantDetail/Location";
import Reviews from "../../Components/RestaurantDetail/Reviews";

// Cart API ko import kiya
import { cartApi, BASE_URL } from "../../services/authApi";

export default function RestaurantDetail() {
  const { rest_id } = useParams(); // URL se restaurant ki dynamic ID
  const [activeCategory, setActiveCategory] = useState("Offers");

  // API States
  const [restaurantData, setRestaurantData] = useState(null);
  const [allDeals, setAllDeals] = useState([]); // Saari deals store karne ke liye
  const [loading, setLoading] = useState(true);

  // Cart operation feedback state (to prevent double-clicks)
  const [cartAddingId, setCartAddingId] = useState(null);
  // 1. Parallel API calls (Restaurant detail aur saari deals)
  useEffect(() => {
    if (rest_id) {
      setLoading(true);

      Promise.all([
        fetch(`${BASE_URL}restaurants/restaurant/${rest_id}`),
        fetch(`${BASE_URL}restaurants/all-deal/`), // Deals API
      ])
        .then(async ([resRestaurant, resDeals]) => {
          if (!resRestaurant.ok)
            throw new Error("Restaurant detail load nahi ho saki");

          const restJson = await resRestaurant.json();
          let dealsJson = { data: [] };

          if (resDeals.ok) {
            dealsJson = await resDeals.json();
          }

          setRestaurantData(restJson?.data || null);
          setAllDeals(dealsJson?.data || []);
        })
        .catch((err) => console.error("API Fetching Error:", err))
        .finally(() => setLoading(false));
    }
  }, [rest_id]);

  // 2. Direct Server-Side Cart Handler
  // Direct Server-Side Cart Handler
  const handleAddToCard = async (item, isDeal = false) => {
    if (cartAddingId) return; // Dubara click hone se bachane ke liye

    try {
      setCartAddingId(item.id);

      // Aapke cartApi.addToCart(menuItemId, dealId) ke mutabiq calls:
      if (isDeal) {
        // Agar deal hai, toh menuItemId ko null bhejenge aur dealId mein item.id
        await cartApi.addToCart(null, item.id);
      } else {
        // Agar normal menu item hai, toh sirf menuItemId bhejenge
        await cartApi.addToCart(item.id);
      }

      window.alert(`"${item.name}" has been added to your cart! 🛒`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding item to server cart:", error);
      window.alert("Failed to add item to cart. Please try again.");
    } finally {
      setCartAddingId(null);
    }
  };

  // Loading Screen
  if (loading && rest_id) {
    return (
      <div className="mx-auto max-w-7xl p-6 text-center text-gray-500 animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6"></div>
        <p className="font-semibold text-lg animate-bounce">
          Loading restaurant data...
        </p>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="mx-auto max-w-7xl p-6 text-center text-gray-500 py-20">
        <p className="font-bold text-xl text-red-500">
          No Restaurant Data Found.
        </p>
      </div>
    );
  }

  // API Menu Items array nikalna
  const menuItems = restaurantData?.menu_items || [];

  // 3. Category Grouping Logic (Menu items ko categories ke mutabiq distribute karna)
  const groupedCategories = menuItems.reduce((acc, item) => {
    const categoryName = item.category?.name || "Others";
    const categoryId = item.category?.id || "others";

    const existingCategory = acc.find((c) => c.name === categoryName);

    if (existingCategory) {
      existingCategory.items.push(item);
    } else {
      acc.push({
        id: categoryId,
        name: categoryName,
        items: [item],
      });
    }
    return acc;
  }, []);

  // Tabs mein "Offers" humesha pehle aayega baaki dynamic categories ke sath
  const apiCategories = [
    "Offers",
    ...groupedCategories.map((category) => category.name),
  ];

  // 4. API Response se sirf iss restaurant ki deals nikalna (Safe check for restaurant items)
  const restaurantDeals = allDeals.filter((deal) => {
    return deal.items?.some(
      (item) => Number(item.menu_item?.restaurant?.id) === Number(rest_id),
    );
  });

  // Safe Image URL helper function
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http") ? imagePath : `${BASE_URL}${imagePath}`;
  };

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-2 p-3">
        {/* Dynamic Hero Section using API data */}
        <RestaurantHero
          data={{
            name: restaurantData.name,
            image: getFullImageUrl(
              restaurantData.image || restaurantData.banner,
            ),
            description:
              restaurantData.description ||
              "Fresh and delicious food served daily.",
            rating: restaurantData.rating || "4.5",
            address: restaurantData.address,
            tags: restaurantData.tags || ["Fast Food", "Pizza", "Burgers"],
          }}
        />

        {/* Dynamic Category Tabs */}
        <OfferCategoryTabs
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          categories={apiCategories}
        />

        {/* Header par dynamic restaurant ka naam */}
        <RestaurantOffersHeader restaurantName={restaurantData.name} />

        {/* Dynamic Deals Section */}
        {activeCategory === "Offers" && (
          <div className="space-y-14">
            {restaurantDeals.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8 bg-gray-50 rounded-xl">
                No active deals available for this restaurant at the moment.
              </p>
            ) : (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                {restaurantDeals.map((deal) => (
                  <DiscountCards
                    key={deal.id}
                    data={{
                      id: deal.id,
                      title: deal.name,
                      discount: `${deal.combo_price}$`,
                      description: deal.description,
                      image: getFullImageUrl(deal.image),
                    }}
                    // Yahan deal pass horhi hai aur second parameter 'true' bhej rahe hain
                    onBtnClick={() =>
                      handleAddToCard({ id: deal.id, name: deal.name }, true)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Category Sections aur unke Menu Items */}
        <div className="space-y-14 pt-8">
          {groupedCategories
            .filter(
              (category) =>
                activeCategory === "Offers" || activeCategory === category.name,
            )
            .map((category) => (
              <section key={category.id}>
                <h2 className="mb-6 text-[32px] font-bold text-[#03081F]">
                  {category.name}
                </h2>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                  {category.items.map((item) => (
                    <Card
                      key={item.id}
                      data={{
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: getFullImageUrl(item.image),
                        description: item.description,
                      }}
                      // Normal menu item click handler
                      onBtnClick={() => handleAddToCard(item, false)}
                      disabled={cartAddingId === item.id}
                    />
                  ))}
                </div>
              </section>
            ))}

          {groupedCategories.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-10">
              No menu items available for this restaurant.
            </p>
          )}
        </div>

        {/* Dynamic Location & Reviews */}
        <Location
          data={{
            address: restaurantData.address,
            lat: restaurantData.latitude,
            lng: restaurantData.longitude,
          }}
        />

        <Reviews restaurantId={rest_id} />

        <div className="pt-22">
          <RestaurantGrid type="Similar" />
        </div>
      </div>
    </>
  );
}
