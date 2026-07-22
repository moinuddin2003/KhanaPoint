import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router"; // <--- useParams aur navigate nikaala
import { BASE_URL } from "../../services/authApi";
import { cartApi } from "../../services/cartApi";
import { toast } from "react-toastify";

// Yahan props se dealId hata diya, direct hook se nikalenge
const DealDetailPage = () => {
  const { dealId } = useParams(); // <--- URL se id mil gayi! (/deal/12 -> dealId = 12)
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/restaurants/deal/${dealId}/`);
        const result = await response.json();
        setDeal(result.data);
      } catch (error) {
        console.error("Error fetching deal details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId]);

  if (loading) {
    return (
      <div className="text-center font-poppins text-lg py-12">
        Loading deal details... 🍔
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center font-poppins text-lg text-red-500 py-12">
        Deal not found!
      </div>
    );
  }

  return (
    <div className="font-poppins bg-white min-h-screen">
      {/* Detail Page content container */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Back button jo humein main home page par wapas le jayega */}

        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 bg-[#fc8a06] hover:bg-[#e07a05] text-white font-bold rounded-full transition-all duration-200 cursor-pointer text-sm shadow-md"
          title="Go Back"
        >
          {/* Arrow icon with a slight transition on hover */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform duration-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Baki design exactly wahi (Jo pehle detail page mein render ho rha tha) */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-[300px] md:h-[400px] rounded-xl overflow-hidden relative shadow-inner">
            <img
              src={`${BASE_URL}${deal.image}`}
              alt={deal.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-between py-2">
            <div>
              <h1 className="text-3xl font-extrabold text-[#03081f] leading-tight mb-3">
                {deal.name}
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {deal.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 text-lg">Special Price:</span>
                <strong className="text-3xl font-extrabold text-[#fc8a06]">
                  ${deal.combo_price}
                </strong>
              </div>

              <button
                onClick={() => {
                  setAdding(true);
                  cartApi
                    .addToCart(null, deal.id) // null menu_item_id, real deal_id
                    .then(() => {
                      toast.success(`${deal.name} added to cart! 🎉`);
                      window.dispatchEvent(new Event("cartUpdated"));
                    })
                    .catch((err) =>
                      toast.error(err.message || "Failed to add deal to cart"),
                    )
                    .finally(() => setAdding(false));
                }}
                disabled={adding}
                className="w-full bg-[#03081f] hover:bg-[#fc8a06] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60"
              >
                {adding ? "Adding..." : "Add Deal to Cart 🛒"}
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-100" />

        {/* Items Grid */}
        <div>
          <h2 className="text-xl font-bold text-[#03081f] mb-6">
            What is inside this combo?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deal.items?.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={`${BASE_URL}${item.menu_item.image}`}
                  alt={item.menu_item.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#03081f] leading-snug">
                      {item.menu_item.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {item.menu_item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="bg-[#fc8a06]/10 text-[#fc8a06] text-xs font-bold px-2 py-0.5 rounded-md">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {item.menu_item.category?.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailPage;
