import { Link, NavLink } from "react-router";
import { Images } from "../../assets";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import RestaurantDropdown from "./RestaurantDropdown";
import { cartApi } from "../../services/cartApi";

const navLinks = [
  { label: "Home", path: "/Home" },
  { label: "Browse Menu", path: "/#menu" },
  { label: "Special Offers", path: "/offers" },
  { label: "Track Order", path: "/orders/track" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0.0);

  useEffect(() => {
    const fetchNavbarCartData = async () => {
      try {
        const response = await cartApi.getCart();
        console.log("API Response:", response); // Console mein check karne ke liye

        // 1. Safe access 'data' object from response
        const cartData = response?.data;

        // 2. 'items' array nikalen aur uski length set karein
        const itemsList = cartData?.items || [];
        const totalCount = itemsList.length;
        setCartCount(totalCount);
        console.log("Total items in cart:", totalCount);

        // 3. 'total_price' ko direct data object se uthayein
        const totalPrice = cartData?.total_price || 0.0;
        setCartTotal(parseFloat(totalPrice).toFixed(2));
        console.log("Total price:", totalPrice);
      } catch (error) {
        console.error("Navbar cart count fetch error:", error);
      }
    };

    fetchNavbarCartData();

    // Auto-update ke liye event listener (taake add-to-cart hote hi navbar refresh ho)
    window.addEventListener("cartUpdated", fetchNavbarCartData);
    return () => {
      window.removeEventListener("cartUpdated", fetchNavbarCartData);
    };
  }, []);

  return (
    <header className="w-full block flex-none relative z-50">
      {/* ── Top promo / utility strip (Desktop Only) ─────────────────────────── */}
      <div className="hidden lg:block w-full bg-[#FBFBFB] border border-black/10 rounded-b-xl font-sans text-black overflow-hidden">
        <div className="h-12 flex items-center justify-between pl-6 pr-0">
          <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
            <span>✨</span>
            <p className="text-[#1C1C1C]">
              Get 5% Off your first order,{" "}
              <span className="text-[#FC8A06] font-bold underline cursor-pointer">
                Promo: ORDER5
              </span>
            </p>
          </div>

          <div className="flex items-center h-full gap-4 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-[#1C1C1C]">
              <img
                src={Images.LocationIcon}
                alt="Location Pin"
                className="w-4 h-4 object-contain"
              />
              <span>Regent Street, A4, A4201, London</span>
              <button className="text-[#edc18f] underline hover:opacity-80 transition-opacity cursor-pointer ml-1">
                Change Location
              </button>
            </div>

            {/* Figma Segmented Basket element */}
            <div className="flex items-center bg-[#028643] text-white font-sans h-full overflow-hidden shrink-0">
              <Link
                to="/cart"
                className="flex items-center justify-center px-5 h-full border-r border-white/20 bg-[#008543]"
              >
                <img
                  src={Images.BasketIcon}
                  alt="Basket"
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
              </Link>

              {/* Dynamic item count container */}
              <div className="flex items-center justify-center px-4 h-full font-semibold text-xs border-r border-white/20">
                {cartCount} {cartCount === 1 ? "Item" : "Items"}
              </div>

              {/* Dynamic Total Price */}
              <div className="flex items-center justify-center px-4 h-full font-semibold text-xs border-r border-white/20">
                GBP {cartTotal}
              </div>

              <button className="flex h-full px-4 items-center justify-center bg-[#016934] hover:bg-black/10 transition-colors cursor-pointer">
                <img
                  src={Images.DownwardBtn}
                  alt="Go to checkout"
                  className="w-4 h-4 object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navbar Level 2 */}
      <div className="w-full hidden lg:block mt-6">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="shrink-0">
            <img
              src={Images.Logo}
              alt="Order UK Logo"
              className="w-[140px] h-auto object-contain"
            />
          </Link>

          <nav className="flex items-center font-sans text-xs sm:text-sm font-semibold whitespace-nowrap">
            {navLinks.slice(0, 3).map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "px-5 py-2.5 bg-[#FC8A06] text-white rounded-full transition-colors duration-200"
                    : "px-4 py-2 text-brand-dark hover:text-[#FC8A06] transition-colors duration-200"
                }
              >
                {link.label}
              </NavLink>
            ))}

            <RestaurantDropdown isMobile={false} />

            {navLinks.slice(3).map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "px-5 py-2.5 bg-[#FC8A06] text-white rounded-full transition-colors duration-200"
                    : "px-4 py-2 text-brand-dark hover:text-[#FC8A06] transition-colors duration-200"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <Link
              to="/"
              className="px-6 h-11 bg-[#03081F] text-white rounded-full flex items-center justify-center gap-2 font-sans text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <div className="w-5 h-5 bg-[#FC8A06] rounded-full flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
                </svg>
              </div>
              <span>Login/Signup</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden w-full bg-white border-b border-gray-200 font-sans">
        <div className="flex h-20 border-b border-gray-100">
          <div className="flex-1 flex items-center pl-4 sm:pl-6">
            <Link
              to="/cart"
              className="bg-[#008543] text-white flex items-center justify-center gap-2.5 px-4 cursor-pointer"
            >
              <img
                src={Images.BasketIcon}
                alt="Basket"
                className="w-5 h-5 object-contain brightness-0 invert shrink-0"
              />
              <span className="tracking-tight font-semibold">
                {cartCount > 0
                  ? `${cartCount} ${cartCount === 1 ? "Item" : "Items"} | GBP ${cartTotal}`
                  : "Empty Cart"}
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center pr-4">
            <ThemeToggle />
          </div>
          <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-l border-gray-200">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-4 text-black focus:outline-none hover:opacity-70 transition-opacity"
              aria-label="Toggle menu"
            >
              <Menu size={32} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 h-16 text-sm sm:text-base font-bold">
          <Link
            to="/"
            className="bg-[#FC8A06] text-black flex items-center justify-center gap-2 px-4 hover:bg-opacity-95 transition-all"
          >
            <div className="w-[22px] h-[22px] bg-black rounded-full flex items-center justify-center shrink-0">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
              </svg>
            </div>
            <span className="tracking-tight">Login/Signup</span>
          </Link>

          {/* ✅ Mobile bottom bar ko dynamic banaya */}
          <Link
            to="/cart"
            className="bg-[#008543] text-white flex items-center justify-center gap-2.5 px-4 cursor-pointer"
          >
            <img
              src={Images.BasketIcon}
              alt="Basket"
              className="w-5 h-5 object-contain brightness-0 invert shrink-0"
            />
            <span className="tracking-tight">GBP {cartTotal}</span>
          </Link>
        </div>

        <div className="flex items-center justify-end h-10 px-4 sm:px-6 bg-white text-brand-dark">
          <div className="flex items-center gap-2">
            <img
              src={Images.LocationIcon}
              alt="Location Pin"
              className="w-[14px] h-[18px] object-contain"
            />
            <span className="text-sm font-medium tracking-tight truncate max-w-[200px]">
              Lution Street, N4G-00...
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Wrapper */}
      {menuOpen && (
        <div className="lg:hidden w-full px-4 py-4 flex flex-col gap-4 bg-white border-b border-black/10 relative z-50">
          {navLinks.slice(0, 3).map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-[#FC8A06] font-semibold"
                  : "text-brand-dark font-medium hover:text-[#FC8A06]"
              }
            >
              {link.label}
            </NavLink>
          ))}

          <RestaurantDropdown
            isMobile={true}
            closeMobileMenu={() => setMenuOpen(false)}
          />

          {navLinks.slice(3).map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-[#FC8A06] font-semibold"
                  : "text-brand-dark font-medium hover:text-[#FC8A06]"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
