import React from "react";
import PromoCard from "../common/PromoCard";

/**
 * PromoCarousel
 * Horizontally scrollable row of PromoCard (discount offers).
 *
 * Props:
 *  - promos (array, required): [{ id, image, badge, brand, title }]
 *  - onAddPromo (function, optional): (promo) => void
 */
export default function PromoCarousel({ promos, onAddPromo }) {
  return (
    <section className="mb-8">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {promos.map((promo) => (
          <div key={promo.id} className="w-64 shrink-0">
            <PromoCard
              image={promo.image}
              badge={promo.badge}
              brand={promo.brand}
              title={promo.title}
              onAdd={() => onAddPromo?.(promo)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
