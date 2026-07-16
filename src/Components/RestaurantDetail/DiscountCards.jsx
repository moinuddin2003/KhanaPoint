import React from "react";
import { Images } from "../../assets";

const DiscountCard = ({ data, onBtnClick }) => {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl">
      {/* Background Image */}
      <img
        src={data.image}
        alt={data.title}
        className="h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Price Badge (Using dynamic combo price) */}
      <div className="absolute right-4 top-0 rounded-b-xl bg-[#03081F] px-5 py-3">
        <span className="text-sm font-semibold text-white">
          {data.discount ? `${data.discount}` : "Offer"}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-5 left-5 right-16">
        {data.description && (
          <p className="mb-1 text-xs font-medium text-[#FC8A06] line-clamp-1">
            {data.description}
          </p>
        )}

        <h2 className="text-[24px] md:text-[28px] font-bold leading-tight text-white line-clamp-2">
          {data.title}
        </h2>
      </div>

      {/* Add Button */}
      <div className="absolute bottom-0 right-0 rounded-tl-[45px] bg-white/80 px-5 pb-2 pt-5 backdrop-blur-sm">
        <button onClick={onBtnClick}>
          <img src={Images.ICN_Plus} alt="Add" className="h-10 w-10" />
        </button>
      </div>
    </div>
  );
};

export default DiscountCard;
