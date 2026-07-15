import React, { useEffect, useState } from "react";

import Card from "../../Components/RestaurantDetail/Card";
import { Images } from "../../assets";
import { data, promos } from "../../utils/dummyData";
import DiscountCards from "../../Components/RestaurantDetail/DiscountCards";
import RestaurantGrid from "../../Components/menu/RestaurantGrid";
import RestaurantHero from "../../Components/RestaurantDetail/RestaurantHero";
import RestaurantOffersHeader from "../../Components/RestaurantDetail/RestaurantOffersHeader";
import OfferCategoryTabs from "../../Components/RestaurantDetail/OfferCategoryTabs";
import Location from "../../Components/RestaurantDetail/Location";
import Reviews from "../../Components/RestaurantDetail/Reviews";

export default function RestaurantDetail() {
  const [activeCategory, setActiveCategory] = useState("Offers");
  const [userCart, setUserCart] = useState([]);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("UserCart")) || [];
    setUserCart(storedCart);
  }, []);

  const handleAddToCard = async (item) => {
    setLoading(true);
    try {
      // 1. Check if this menu item is already in our backend cart
      // Note: If your GET /order/cart/ items object has a structure, we look for a match
      const existingCartItem = userCart.find(
        (cartItem) => cartItem.name === item.name,
      );

      if (existingCartItem) {
        // If it exists in the cart, increment its quantity using its Cart Item ID (existingCartItem.id)
        const newQuantity = existingCartItem.quantity + 1;
        await cartApi.updateItemQuantity(existingCartItem.id, newQuantity);
      } else {
        // If it is not in the cart, add it as a new menu_item_id
        await cartApi.addToCart(item.id);
      }

      // 2. Re-fetch the updated cart from the database to update the local React state
      await fetchCart();
      window.alert("Cart Updated");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      window.alert("Failed to update cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-2 p-3">
        <RestaurantHero />

        <OfferCategoryTabs
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <RestaurantOffersHeader restaurantName="McDolands" />
        <div className="space-y-14">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
            {promos.map((promo) => (
              <DiscountCards
                key={promo.id}
                data={promo}
                onBtnClick={() => console.log("Discount Card Clicked")}
              />
            ))}
          </div>
        </div>
        {/* Restaurant Categories With Items */}
        <div className="space-y-14">
          {data.map((category) => (
            <section key={category.id}>
              <h2 className="mb-6 text-[32px] font-bold text-[#03081F]">
                {category.name}
              </h2>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                {category.items.map((item) => (
                  <Card
                    key={item.id}
                    data={item}
                    onBtnClick={() => handleAddToCard(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <Location />

        <Reviews />
        <div className="pt-22">
          <RestaurantGrid type="Similar" />
        </div>

      </div>
    </>
  );
}
