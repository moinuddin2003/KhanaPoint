import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getMenuItems } from "../../services/restaurantAPI";
import { BASE_URL } from "../../services/authApi";
// 1. Apni cart API import karein (jo bhi aapka cart api file ka path ho)
import { cartApi } from "../../services/cartApi";
import { Images } from "../../assets";

function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null); // Button loader state ka track rakhne ke liye

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        setLoading(true);
        const data = await getMenuItems();
        const itemsList = Array.isArray(data) ? data : data?.data || [];
        setMenuItems(itemsList);
      } catch (error) {
        console.error("Error fetching items for category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [categoryId]);

  // Direct Add to Cart function
  const handleAddToCart = async (itemId) => {
    try {
      setAddingId(itemId); // Loader start

      // Apne backend schema ke mutabik check karein (kuch systems mein menu_item_id jata hai, kuch mein direct item id)
      await cartApi.addToCart(itemId);

      // 🔥 Navbar update trigger karne ke liye custom event
      window.dispatchEvent(new Event("cartUpdated"));

      console.log(`Item ${itemId} successfully added to cart!`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setAddingId(null); // Loader stop
    }
  };

  const filteredItems = menuItems.filter(
    (item) => item.category && String(item.category.id) === String(categoryId),
  );

  const categoryName = filteredItems[0]?.category?.name || "Category Items";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-10">
      {/* Back Button & Header */}
      {/* Back Button & Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white border border-gray-100 hover:border-gray-200 text-gray-700 hover:text-brand-orange rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
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
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
          {categoryName}
        </h1>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No items found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="h-48 overflow-hidden bg-gray-50 relative">
                <img
                  src={`${BASE_URL}${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-brand-orange text-white px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                  £{parseFloat(item.price).toFixed(2)}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#03081F] mb-1">
                    {item.name}
                  </h3>
                  <p className="font-body text-[14px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Restaurant Info & Add to Cart Button */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                  {item.restaurant && (
                    <div
                      onClick={() =>
                        navigate(`/restaurant/${item.restaurant.id}`)
                      }
                      className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={`${BASE_URL}${item.restaurant.image}`}
                          alt={item.restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-body font-semibold text-xs text-gray-600">
                        {item.restaurant.name}
                      </span>
                    </div>
                  )}

                  {/* 🔥 ORANGE ADD TO CART ICON */}
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    disabled={addingId === item.id}
                    className="w-10 h-10 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 disabled:bg-gray-300 disabled:scale-100 transition-all duration-200 cursor-pointer"
                    title="Add to Cart"
                  >
                    {addingId === item.id ? (
                      /* Spinner Loader while adding */
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      /* Plus/Cart Icon */
                      <img src={Images.Cart} alt="Add" className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
