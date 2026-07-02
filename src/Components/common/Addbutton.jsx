import React from "react";
import addShape from "../../assets/shape.png";
import addPlus from "../../assets/plus.png";

/**
 * AddButton
 * The "+" button on every card. In the real design it's TWO layered
 * images:
 *   1. A white curved shape that peeks out behind (Rectangle-47.png)
 *   2. The dark circle with the "+" icon, sitting on top (Plus.png)
 *
 * These two assets never change per-card, so they're imported directly
 * here instead of being passed as props everywhere. Just use:
 *
 *   <AddButton onClick={...} />
 *
 * Props:
 *  - onClick (function, optional)
 *  - className (string, optional): extra positioning classes from the
 *    parent, e.g. "absolute bottom-2 right-2"
 */
export default function AddButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add"
      className={`relative h-11 w-11 ${className}`}
    >
      {/* white shape, sits behind and slightly offset toward the corner */}
      <img
        src={addShape}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-8 w-8 object-contain"
      />
      {/* dark plus circle, on top, centered in the tap target */}
      <img
        src={addPlus}
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
      />
    </button>
  );
}
