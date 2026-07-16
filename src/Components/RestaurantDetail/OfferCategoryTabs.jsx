import { useTheme } from "../../context/ThemeContext";

// Ab hum 'categories' ko as a prop le rahe hain
function OfferCategoryTabs({ activeCategory, onSelect, categories = [] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Hamesha 'Offers' ko list ke shuru mein lazmi dikhane ke liye logic
  const displayCategories = categories.includes("Offers")
    ? categories
    : ["Offers", ...categories];

  return (
    <div
      className={`w-full overflow-x-auto font-poppins px-4 py-4 md:px-6 ${
        isDark ? "bg-brand-orange" : "bg-[#f3f3f3]"
      }`}
      // Inline styles to hide the scrollbar for a cleaner UI
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      {/* Webkit scrollbar hiding via style tag for Chrome/Safari */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* min-w-max prevents the flex container from crushing the items on mobile.
         lg:justify-between allows them to spread evenly on large screens. 
      */}
      <div className="flex items-center justify-start lg:justify-between min-w-max gap-2 md:gap-4">
        {displayCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-[13px] sm:text-sm md:text-base transition-colors cursor-pointer shrink-0 ${
              activeCategory === cat
                ? "bg-[#03081f] text-white shadow-md"
                : "bg-transparent text-black hover:bg-black/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OfferCategoryTabs;