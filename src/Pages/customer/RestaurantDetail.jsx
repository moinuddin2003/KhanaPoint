import React, { useEffect, useState } from "react";

import Card from "../../Components/RestaurantDetail/Card";
import { Images } from "../../assets";
import { data } from "../../utils/dummyData";

export default function RestaurantDetail() {
  const [userCart, setUserCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("UserCart")) || [];
    setUserCart(storedCart);
  }, []);

  const handleAddToCard = (item) => {
    const updatedCart = [...userCart, item];

    setUserCart(updatedCart);

    setTimeout(() => {
      localStorage.setItem("UserCart", JSON.stringify(updatedCart));
      window.alert("Cart Updated");
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-2 p-6">
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
    </div>
  );
}
