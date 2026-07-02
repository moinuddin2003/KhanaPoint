import React from "react";
import AddButton from "./AddButton";

/**
 * Card
 * The white "food item" card: text on the left, image on the right,
 * price at the bottom, "+" button overlaid on the image corner.
 *
 * Used for:
 *  - Image 1 ("The classics for 3" — a single standalone card)
 *  - Image 3 (every card inside the Burgers / Fries / Cold Drinks grids)
 *
 * Props:
 *  - image (string, required)
 *  - title (string, required)
 *  - description (string, optional)
 *  - price (string, required) e.g. "GBP 23.10"
 *  - onAdd (function, optional)
 */
export default function Card({ image, title, description, price, onAdd }) {
  return (
    <div className="flex items-stretch gap-3 rounded-2xl bg-white p-3 shadow-sm">
      {/* Text side */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="text-sm font-bold text-[#12122B] sm:text-base">{title}</h3>
          {description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-3 sm:text-sm">
              {description}
            </p>
          )}
        </div>
        <p className="mt-2 text-xs font-bold text-[#12122B] sm:text-sm">{price}</p>
      </div>

      {/* Image side */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <AddButton onClick={onAdd} className="absolute bottom-1.5 right-1.5" />
      </div>
    </div>
  );
}