import React from "react";
import { Images } from "../../assets";

const DiscountCard = ({ data, onBtnClick }) => {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl">
      {/* Background Image */}
      <img
        src={data.image}
        alt={data.title}
        className="h-auto w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Discount Badge */}
      <div className="absolute right-4 top-0 rounded-b-xl bg-[#03081F] px-5 py-3">
        <span className="text-sm font-semibold text-white">{data.badge}</span>
      </div>

      {/* Text */}
      <div className="absolute bottom-5 left-5">
        <p className="mb-1 text-sm font-medium text-[#FC8A06]">{data.brand}</p>

        <h2 className="text-[32px] font-bold leading-none text-white">
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
