import { useState, useEffect } from "react";
import { useParams } from "react-router"; // URL se ID nikalne ke liye
import { FaClock } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { Images } from "../../assets";
import { BASE_URL } from "../../services/authApi"; // Agar BASE_URL defined hai backend domain ke liye

export default function RestaurantHero() {
  const { rest_id } = useParams(); // URL se dynamic ID li
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // API se single restaurant ka data load karna
  useEffect(() => {
    if (rest_id) {
      setLoading(true);
      fetch(`${BASE_URL}restaurants/restaurant/${rest_id}`)
        .then((res) => {
          if (!res.ok)
            throw new Error("Restaurant data fetch karne mein masla hua");
          return res.json();
        })
        .then((resData) => {
          setRestaurant(resData?.data || null);
        })
        .catch((err) => console.error("Hero API Error:", err))
        .finally(() => setLoading(false));
    }
  }, [rest_id]);

  // Loading State (Skeleton)
  if (loading) {
    return (
      <section className="px-4 sm:px-6 md:px-10 lg:px-8 xl:px-20 py-6 sm:py-10 animate-pulse">
        <div className="h-[380px] xl:h-[420px] bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
      </section>
    );
  }

  // Agar restaurant ka data kisi wajah se na mile
  if (!restaurant) {
    return (
      <section className="px-4 sm:px-6 md:px-10 lg:px-8 xl:px-20 py-6 sm:py-10 text-center">
        <p className="text-gray-500">Restaurant details not found.</p>
      </section>
    );
  }

  // Base URL fallback handle karne ke liye (agar image string lagani ho)
  const restaurantImage = restaurant.image.startsWith("http")
    ? restaurant.image
    : `http://127.0.0.1:8000${restaurant.image}`;

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-8 xl:px-20 py-6 sm:py-10">
      <div className="relative overflow-visible rounded-2xl">
        {/* Main Inner Container */}
        <div className="relative overflow-hidden rounded-2xl h-auto min-h-80 sm:min-h-95 lg:min-h-0 lg:h-[380px] xl:h-[420px] flex flex-col lg:block justify-center py-8 lg:py-0">
          {/* Background Image */}
          <img
            src={isDark ? Images.bgImgDark : Images.bgImg}
            alt="Restaurant background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* =========================================
              DESKTOP VIEW IMAGES (Dynamic Profile/Dish Image)
          ========================================= */}
          <img
            src={restaurantImage}
            alt={restaurant.name}
            className="hidden lg:block absolute lg:-right-4 xl:right-12 top-1/2 -translate-y-1/2 lg:h-64 xl:h-80 w-auto object-contain rounded-xl z-10 pointer-events-auto shadow-sm"
          />

          <div className="hidden lg:block absolute lg:right-[28%] xl:right-[35%] lg:top-[68%] xl:top-[62%] w-32 xl:w-44 bg-white rounded-xl shadow-xl p-3 xl:px-6 xl:py-4 z-30">
            <img
              src={Images.ReviewsNumber}
              alt="Customer review"
              className="w-full"
            />
          </div>

          {/* =========================================
              MOBILE VIEW CONTENT (Flex Stack Layout)
          ========================================= */}
          <div className="relative z-20 flex flex-col items-center lg:items-start lg:block w-full h-full">
            {/* 1. Mobile Top Dynamic Image */}
            <div className="flex justify-center lg:hidden w-full order-1 px-4 mb-6 mt-4 relative">
              <div className="relative inline-flex justify-center items-center">
                <img
                  src={restaurantImage}
                  alt={restaurant.name}
                  className="h-48 sm:h-60 object-contain rounded-xl relative z-10 shadow-md"
                />
                {/* Overlapping Review Badge */}
                <div className="absolute -left-6 sm:-left-10 top-40 -translate-y-1/2 w-20 sm:w-24 bg-white rounded-xl shadow-xl p-2 z-20">
                  <img
                    src={Images.ReviewsNumber}
                    alt="Review"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* 2. Mobile Orange Button */}
            <div className="lg:hidden order-2 w-full px-4 sm:px-10 mb-8 flex justify-center">
              <button className="w-full bg-[#FC8A06] hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg text-base sm:text-lg">
                <FaClock className="text-lg sm:text-xl" />
                <span>Open until 10:30 AM</span>
              </button>
            </div>

            {/* 3. Text & Badges (Dynamic Content) */}
            <div className="relative z-30 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-4 sm:px-10 lg:px-12 xl:px-20 w-full lg:w-[55%] xl:w-1/2 order-3 lg:h-full lg:absolute lg:top-0 lg:left-0">
              {/* Dynamic Description / Tagline */}
              <p
                className={`text-sm sm:text-base md:text-sm mb-2 sm:mb-3 font-medium line-clamp-2 max-w-sm ${
                  isDark ? "text-gray-200 lg:text-white" : "text-gray-700"
                }`}
              >
                {restaurant.description ||
                  "Your favorite meals, delivered fresh!"}
              </p>

              {/* Dynamic Restaurant Name & Address */}
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {restaurant.name}
                <span className="block text-sm sm:text-base md:text-lg font-normal opacity-80 mt-1">
                  {restaurant.address}
                </span>
              </h1>

              {/* Info Badges */}
              <div className="flex flex-col xl:flex-row lg:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full lg:w-auto">
                <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#03081F] text-white px-4 xl:px-5 py-4 lg:py-3 rounded-full text-sm sm:text-base lg:text-sm xl:text-md w-full lg:w-auto shadow-md">
                  <img
                    src={Images.MotoCross}
                    alt="Minimum Order"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  />
                  <span className="whitespace-nowrap font-medium">
                    Minimum Order: 12 GBP
                  </span>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#03081F] text-white px-4 xl:px-5 py-4 lg:py-3 rounded-full text-sm sm:text-base lg:text-sm xl:text-md w-full lg:w-auto shadow-md">
                  <img
                    src={Images.OrderComplete}
                    alt="Delivery Time"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  />
                  <span className="whitespace-nowrap font-medium">
                    Delivery in 20-25 Min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            DESKTOP BOTTOM BUTTON (Hidden on Mobile)
        ========================================= */}
        <div className="hidden lg:flex lg:absolute lg:left-0 lg:top-full lg:-translate-y-1/2 lg:z-30">
          <button className="bg-[#FC8A06] hover:bg-orange-600 text-white px-6 xl:px-8 py-3 xl:py-4 lg:rounded-t-none lg:rounded-tr-xl lg:rounded-br-none lg:rounded-bl-none font-semibold flex items-center justify-start gap-2 transition-colors">
            <FaClock className="text-base" />
            <span className="text-sm xl:text-base">Open until 10:30 AM</span>
          </button>
        </div>
      </div>
    </section>
  );
}
