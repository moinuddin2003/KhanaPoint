import { Images } from "../../assets";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center">
        <div className="w-full max-w-[560px] rounded-[32px] border border-[#E8E8E8] bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <img
              src={Images.Logo}
              alt="Order UK"
              className="h-14 object-contain"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
