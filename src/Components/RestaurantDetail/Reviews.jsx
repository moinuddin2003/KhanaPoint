import { useState } from "react";
import { Images } from "../../assets";

const reviewsData = [
  {
    name: "St Glx",
    location: "South London",
    date: "24th September, 2023",
    rating: 5,
    text: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    image: Images.ReviewsImage,
  },
  {
    name: "Amara K.",
    location: "Manchester",
    date: "12th October, 2023",
    rating: 4,
    text: "Incredibly fast delivery and the packaging kept everything piping hot! The loaded fries were absolute perfection, though I wish they had included a few extra sauce packets as requested.",
    image: Images.ReviewsImage,
  },
  {
    name: "Marcus Davies",
    location: "Birmingham",
    date: "05th November, 2023",
    rating: 5,
    text: "Super clean presentation and a brilliant selection on the digital menu. The custom burgers tasted remarkably fresh, and ordering via the app made tracking our driver completely seamless.",
    image: Images.ReviewsImage,
  },
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = reviewsData.length;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
  };

  const getVisibleReviews = (count) => {
    return Array.from({ length: Math.min(count, total) }, (_, i) => {
      const index = (currentIndex + i) % total;
      return { ...reviewsData[index], key: index };
    });
  };

  const visibleMobile = getVisibleReviews(1);
  const visibleDesktop = getVisibleReviews(3);

  return (
    <div className="relative bg-gradient-to-b from-[#fdfdfd] to-[#f4f4f4] w-full py-16 lg:py-24 overflow-hidden">
      {/* ══════════════════════ 1. MOBILE LAYOUT (lg:hidden) ══════════════════════ */}
      <div className="lg:hidden flex flex-col items-center px-4 w-full">
        <h2 className="font-heading font-extrabold text-[32px] text-center text-brand-dark mb-2 tracking-tight">
          Customer Reviews
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center max-w-sm">
          Hear what our lovely customers have to say about our food and
          services.
        </p>

        {/* Overall Rating Badge */}
        <div className="mb-8 flex justify-center transform hover:scale-105 transition-transform duration-300">
          <img
            src={Images.ReviewsNumber}
            alt="Overall Rating"
            className="w-[140px] h-[160px] rounded-[16px] bg-white border border-gray-100 shadow-lg object-contain p-2"
          />
        </div>

        {/* Card Container */}
        <div className="w-full flex items-center justify-center min-h-[290px] px-2">
          {visibleMobile.map((review) => (
            <div
              key={`mobile-${review.key}`}
              className="w-full max-w-[450px] min-h-[260px] bg-white p-6 flex flex-col justify-between rounded-[16px] shadow-md border border-gray-50/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-[50px] h-[50px] rounded-full bg-gray-200 overflow-hidden shrink-0 ring-2 ring-brand-orange/20">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-[3px] h-[35px] bg-brand-orange rounded-full"></div>
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-[16px] text-[#03081F] leading-tight">
                      {review.name}
                    </span>
                    <span className="font-body font-medium text-[13px] text-brand-orange leading-tight mt-0.5">
                      {review.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between sm:items-end items-center gap-1.5">
                  <div className="flex gap-0.5 text-brand-orange text-lg">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="drop-shadow-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full">
                    <span className="text-brand-orange text-xs">🕒</span>
                    <span className="font-body font-semibold text-[11px] text-gray-500">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>

              <p className="font-body font-normal text-[14px] leading-[22px] text-gray-600 italic">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={handlePrev}
            className="w-[50px] h-[50px] bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white active:scale-95 transition-all duration-200"
          >
            <span className="text-lg font-bold">&lt;</span>
          </button>
          <button
            onClick={handleNext}
            className="w-[50px] h-[50px] bg-brand-orange shadow-md rounded-full flex items-center justify-center text-white active:scale-95 hover:bg-brand-orange/90 transition-all duration-200"
          >
            <span className="text-lg font-bold">&gt;</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════ 2. DESKTOP LAYOUT (hidden lg:block) ══════════════════════ */}
      <div className="hidden lg:block max-w-[1300px] mx-auto px-10 relative">
        <div className="w-full flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading font-extrabold text-[46px] leading-tight text-brand-dark tracking-tight">
              Customer Reviews
            </h2>
            <p className="text-gray-500 text-base mt-2">
              What our verified users say about their dining and delivery
              experience.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="w-[60px] h-[60px] bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white cursor-pointer transition-all duration-300"
            >
              <span className="text-xl font-bold">&lt;</span>
            </button>
            <button
              onClick={handleNext}
              className="w-[60px] h-[60px] bg-brand-orange shadow-md hover:shadow-lg rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-brand-orange/90 transition-all duration-300"
            >
              <span className="text-xl font-bold">&gt;</span>
            </button>
          </div>
        </div>

        {/* Cards Row */}
        <div className="w-full flex items-stretch justify-center gap-6 mb-16">
          {visibleDesktop.map((review) => (
            <div
              key={`desktop-${review.key}`}
              className="w-[32%] min-w-[340px] max-w-[400px] bg-white p-8 flex flex-col justify-between rounded-[20px] shadow-md border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between w-full border-b border-gray-100 pb-5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-[54px] h-[54px] rounded-full bg-gray-200 overflow-hidden ring-4 ring-brand-orange/10">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-[3px] h-[40px] bg-brand-orange rounded-full"></div>
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-[17px] text-[#03081F] leading-tight">
                      {review.name}
                    </span>
                    <span className="font-body font-semibold text-[14px] text-brand-orange leading-tight mt-0.5">
                      {review.location}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex gap-0.5 text-brand-orange">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-0.5 rounded-full">
                    <span className="text-brand-orange text-xs">🕒</span>
                    <span className="font-body font-semibold text-[12px] text-gray-500">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-body font-normal text-[15px] leading-[24px] text-gray-600 italic flex-1">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Badge positioned modernly at bottom center */}
        {/* <div className="flex justify-center mt-4">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <img
              src={Images.ReviewsNumber}
              alt="Overall Rating"
              className="w-[150px] h-[170px] rounded-[16px] bg-white border border-gray-100 shadow-xl p-2"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Reviews;
