import React from "react";
import { Images } from "../../assets";
const DiscountCards = () => {
  return (
    <div className="overflow-hidden relative rounded-4xl p-5 s bg-white">
      <div className="img h-80 w-80 ">
        <img src={Images.IceCream} />
      </div>
      <div className="absolute bottom-36 pl-5">
        <p className="text-[#FC8A06]">McDonald’s East London</p>
        <h1 className="text-white">First Order Discount</h1>
      </div>
      <div className="absolute bottom-32 left-71 rounded-tl-4xl opacity-90 rounded-br-lg bg-white/80 px-3  pt-5 backdrop-blur-sm">
        <button onClick={() => console.log(first)}>
          <img src={Images.ICN_Plus} alt="" className="h-8 w-8 " />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 rounded-tl-4xl opacity-90 rounded-br-lg bg-black/80 px-3  pt-5 backdrop-blur-sm">
        -20%
      </div>
    </div>
  );
};

export default DiscountCards;
