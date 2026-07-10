import { useTheme } from "../../context/ThemeContext";
import { ChevronRight } from "lucide-react";
import { Images } from "../../assets";

const HeroBanner = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="relative mx-auto mt-6 lg:mt-8 w-[calc(100%-2rem)] max-w-[1528px] min-h-[360px] lg:h-[610px] border border-black/20 rounded-[5px] overflow-hidden flex flex-col justify-center items-center lg:block px-4 py-10 lg:p-0"
      style={{ backgroundColor: isDark ? "#03081F" : "#E2E2E2" }}
    >
      {/* ─── TEXT & SEARCH (Foreground) ────────────────────────────────────── */}
      <div
        className="relative lg:absolute lg:left-0 lg:top-0 w-full max-w-[400px] lg:max-w-none lg:w-[550px] lg:h-full flex flex-col items-center lg:items-start lg:justify-center text-center lg:text-left lg:pl-[157px] z-50 select-none"
        style={{ color: isDark ? "#FFFFFF" : "#03081F" }}
      >
        <p className="text-[13px] sm:text-[14px] lg:text-[16px] font-normal leading-6 m-0">
          Order Restaurant food, takeaway and groceries.
        </p>

        <h1 className="text-[36px] sm:text-[42px] lg:text-[54px] font-semibold leading-[1.1] lg:leading-[60px] tracking-tight m-0 mt-3 lg:w-[509px]">
          Feast Your Senses,
          <br />
          <span className="text-brand-orange">Fast and Fresh</span>
        </h1>

        <div className="flex flex-col mt-6 lg:mt-8 w-full items-center lg:items-start">
          <label className="text-[12px] sm:text-[13px] font-normal mb-3 m-0">
            Enter a postcode to see what we deliver
          </label>

          {/* Search Input Container */}
          <div className="relative flex items-center w-full max-w-[340px] lg:max-w-none lg:w-[373px] h-[50px] lg:h-[57px]">
            <input
              type="text"
              placeholder="e.g. EC4R 3TE"
              className="absolute inset-0 w-full h-full bg-white border border-black/40 rounded-full pl-6 pr-[60px] lg:pr-[190px] text-[14px] lg:text-[15px] text-black placeholder-black/60 font-normal outline-none focus:border-brand-orange transition-colors shadow-sm"
            />

            {/* Mobile Button (Arrow Icon) - FIXED */}
            <button
              type="button"
              className="absolute right-1 w-[42px] h-[42px] flex items-center justify-center bg-brand-orange rounded-full lg:hidden active:scale-95 transition-transform"
            >
              <div className="w-[24px] h-[24px] bg-[#03081F] rounded-full flex items-center justify-center">
                <ChevronRight
                  size={16}
                  className="text-brand-orange ml-0.5"
                  strokeWidth={3}
                />
              </div>
            </button>

            {/* Desktop Button (Text) */}
            <button
              type="button"
              className="hidden lg:flex absolute right-0 shrink-0 h-full w-[188px] items-center justify-center bg-brand-orange text-white font-bold text-[16px] rounded-full hover:bg-[#e07a00] active:scale-[0.98] shadow-md transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP GRAPHICS (Hidden on Mobile) ───────────────────────────── */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {/* Orange corner shape */}
        <div className="absolute right-0 bottom-0 w-[626px] h-[565px] overflow-hidden rounded-tl-[282px] rounded-br-[12px] z-0">
          <img
            src={Images.OrangeShape}
            alt=""
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>

        {/* Hero1 — people/food photo */}
        <div
          className="absolute top-[73px] w-[805px] h-[537px] overflow-hidden z-20"
          style={{ left: isDark ? "342px" : "323px" }}
        >
          <img
            src={isDark ? Images.HeroDark1 : Images.Hero1}
            alt="Feasting graphics primary"
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        </div>

        {/* Hero2 — notification backdrop image */}
        <div
          className="absolute overflow-hidden rounded-t-[12px] z-10"
          style={
            isDark
              ? { left: "690px", top: "69px", width: "465px", height: "541px" }
              : { left: "860px", top: "155px", width: "377px", height: "455px" }
          }
        >
          <img
            src={isDark ? Images.HeroDark2 : Images.Hero2}
            alt="Feasting graphics secondary notifications"
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>

        {/* Notification overlay cards */}
        <div className="absolute right-[100px] top-[100px] w-[390px] h-[480px] z-50">
          <div className="absolute top-0 right-0 flex flex-col items-end">
            <img
              src={Images.Img1}
              alt=""
              className="h-[55px] object-contain -mb-3 mr-12 opacity-80"
            />
            <div className="w-[342px] bg-white rounded-[15px] p-4 shadow-xl border border-black/5 pointer-events-auto">
              <div className="flex justify-between items-center mb-1.5">
                <img
                  src={Images.HeroLogoUK}
                  alt="Order.uk"
                  className="h-[16px] object-contain"
                />
                <span className="text-[12px] text-black/40 font-medium">
                  now
                </span>
              </div>
              <h4 className="text-[14px] font-bold text-[#03081F] m-0">
                We've Received your order!
              </h4>
              <p className="text-[12px] text-black/60 font-medium mt-0.5 m-0">
                Awaiting Restaurant acceptance📍
              </p>
            </div>
          </div>

          <div className="absolute top-[145px] right-[-40px] flex flex-col items-end">
            <img
              src={Images.Img2}
              alt=""
              className="h-[55px] object-contain -mb-3 mr-12 opacity-80"
            />
            <div className="w-[342px] bg-white rounded-[15px] p-4 shadow-xl border border-black/5 pointer-events-auto">
              <div className="flex justify-between items-center mb-1.5">
                <img
                  src={Images.HeroLogoUK}
                  alt="Order.uk"
                  className="h-[16px] object-contain"
                />
                <span className="text-[12px] text-black/40 font-medium">
                  now
                </span>
              </div>
              <h4 className="text-[14px] font-bold text-[#03081F] m-0 flex items-center gap-1">
                Order Accepted! <span className="text-sm">✅</span>
              </h4>
              <p className="text-[12px] text-black/60 font-medium mt-0.5 m-0">
                Your order will be delivered shortly
              </p>
            </div>
          </div>

          <div className="absolute top-[290px] right-0 flex flex-col items-end">
            <img
              src={Images.Img2}
              alt=""
              className="h-[55px] object-contain -mb-3 mr-14 opacity-80"
            />
            <div className="w-[342px] bg-white rounded-[15px] p-4 shadow-xl border border-black/5 pointer-events-auto">
              <div className="flex justify-between items-center mb-1.5">
                <img
                  src={Images.HeroLogoUK}
                  alt="Order.uk"
                  className="h-[16px] object-contain"
                />
                <span className="text-[12px] text-black/40 font-medium">
                  now
                </span>
              </div>
              <h4 className="text-[14px] font-bold text-[#03081F] m-0">
                Your rider's nearby 🎉
              </h4>
              <p className="text-[12px] text-black/60 font-medium mt-0.5 m-0">
                They're almost there – get ready!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
