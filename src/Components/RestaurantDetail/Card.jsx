import React from "react";
import { Images } from "../../assets";

const Card = ({ data, onBtnClick }) => {
  return (
    <article className="overflow-hidden rounded-xl p-5 bg-white shadow-[5px_5px_34px_0px_rgba(0,0,0,0.12)]">
      <div className="flex justify-between gap-4">
        {/* Left Side: Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="text-[18px] font-bold leading-6 text-[#03081F] line-clamp-2">
              {data.name}
              {/* Fallback handle kiya taake name ya title dono chal jayein */}
            </h3>

            {data.description && (
              <p className="mt-4 text-[14px] leading-6 text-[#555] line-clamp-3">
                {data.description}
              </p>
            )}
          </div>

          <p className="text-[18px] font-bold text-[#03081F] mt-3">
            {data.price ? `£${data.price}` : "N/A"}
          </p>
        </div>

        {/* Right Side: Image and Add Button */}
        <div className="relative shrink-0">
          <img
            src={data.image}
            alt={data.title || data.name}
            className="h-40 w-36 rounded-xl object-cover"
          />

          {/* Add Button */}
          <div className="absolute bottom-0 right-0 rounded-tl-4xl opacity-90 rounded-br-lg bg-white/80 px-3 pt-5 backdrop-blur-sm">
            <button onClick={onBtnClick}>
              <img src={Images.ICN_Plus} alt="Add" className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
