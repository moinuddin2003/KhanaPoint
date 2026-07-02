import React from "react";
import AddButton from "./AddButton";

/**
 * PromoCard
 * Full-background-image card used in the discount carousel
 * (First Order Discount / Vegan Discount / Free Ice Cream Offer).
 *
 * Props:
 *  - image (string, required): background photo
 *  - badge (string, optional): e.g. "-30%", "-100%"
 *  - brand (string, optional): small line above the title
 *  - title (string, required)
 *  - onAdd (function, optional)
 */
export default function PromoCard({ image, badge, brand, title, onAdd }) {
  return (
    <div
      className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-cover bg-center sm:h-44"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* darken bottom so text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {badge && (
        <span className="absolute right-2 top-2 rounded-md bg-[#12122B] px-2 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}

      <div className="absolute bottom-2 left-3 right-10">
        {brand && <p className="truncate text-[10px] text-white/80">{brand}</p>}
        <h3 className="truncate text-sm font-bold text-white sm:text-base">
          {title}
        </h3>
      </div>

      <AddButton onClick={onAdd} className="absolute bottom-2 right-2" />
    </div>
  );
}
