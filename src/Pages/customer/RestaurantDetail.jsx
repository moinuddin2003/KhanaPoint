import React from "react";
import PromoCarousel from "../../components/menu/PromoCarousel";
import MenuSection from "../../components/menu/MenuSection";

// Static/hardcoded data for now — backend/API will replace this later.
const promos = [
  {
    id: "p1",
    image: "/assets/promo-first-order.jpg",
    badge: "-30%",
    brand: "McDonald's Fast Food",
    title: "First Order Discount",
  },
  {
    id: "p2",
    image: "/assets/promo-vegan.jpg",
    badge: "-30%",
    brand: "McDonald's Fast Food",
    title: "Vegan Discount",
  },
  {
    id: "p3",
    image: "/assets/promo-ice-cream.jpg",
    badge: "-100%",
    brand: "McDonald's Fast Food",
    title: "Free Ice Cream Offer",
  },
];

const burgers = [
  {
    id: "b1",
    image: "/assets/royal-cheese-burger.jpg",
    title: "Royal Cheese Burger with extra Fries",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
  },
  {
    id: "b2",
    image: "/assets/classics-for-3.jpg",
    title: "The classics for 3",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
  },
  // ...more burger items
];

const fries = [
  {
    id: "f1",
    image: "/assets/royal-cheese-burger.jpg",
    title: "Royal Cheese Burger with extra Fries",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
  },
  // ...more fries items
];

const coldDrinks = [
  {
    id: "d1",
    image: "/assets/cold-drink.jpg",
    title: "Royal Cheese Burger with extra Fries",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
  },
  // ...more drink items
];

export default function RestaurantDetail() {
  const handleAddItem = (item) => {
    console.log("Add to cart:", item);
  };

  const handleAddPromo = (promo) => {
    console.log("Apply promo:", promo);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-2 p-6">
      <PromoCarousel promos={promos} onAddPromo={handleAddPromo} />

      <MenuSection title="Burgers" items={burgers} onAddItem={handleAddItem} />
      <MenuSection title="Fries" items={fries} onAddItem={handleAddItem} />
      <MenuSection
        title="Cold Drinks"
        items={coldDrinks}
        onAddItem={handleAddItem}
      />
    </div>
  );
}
