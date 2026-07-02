import React from "react";
import Card from "../common/Card";

/**
 * MenuSection
 * A category heading + grid of Card components. This ONE component
 * is reused for Burgers, Fries, and Cold Drinks — only the `title`
 * and `items` prop change per section, no need for separate
 * Burgers.jsx / Fries.jsx / ColdDrinks.jsx files.
 *
 * Props:
 *  - title (string, required): e.g. "Burgers", "Fries", "Cold Drinks"
 *  - items (array, required): [{ id, image, title, description, price }]
 *  - onAddItem (function, optional): (item) => void
 */
export default function MenuSection({ title, items, onAddItem }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-[#12122B] sm:text-2xl">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            image={item.image}
            title={item.title}
            description={item.description}
            price={item.price}
            onAdd={() => onAddItem?.(item)}
          />
        ))}
      </div>
    </section>
  );
}
