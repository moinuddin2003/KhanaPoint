import { useTheme } from "/src/context/ThemeContext";

function CategoryCard({ image, name, restaurantCount, onClick }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl overflow-hidden shadow-sm bg-brand-orange font-poppins
                 cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-orange"
    >
      <div
        className={`w-full rounded-xl overflow-hidden shadow-sm ${isDark ? "bg-[#03081f]" : "bg-white"} font-poppins`}
      >
        <img src={image} alt={name} className="w-full h-[160px] object-cover" />
        <div className="px-3 py-3">
          <p
            className={`${isDark ? "text-brand-orange" : "text-black"} font-bold text-base`}
          >
            {name}
          </p>
          <p className={`${isDark ? "text-white" : "text-[#fc8a06]"} text-sm`}>
            {restaurantCount}
          </p>
        </div>
      </div>
    </button>
  );
}

export default CategoryCard;
