function RestaurantCard({ image, name, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl overflow-hidden shadow-sm bg-[#FC8A06] font-poppins
                 cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
    >
      <img src={image} alt={name} className="w-full h-[160px] object-cover" />
      <div className="px-3 py-3">
        <p className="text-white font-bold text-base">{name}</p>
      </div>
    </button>
  );
}

export default RestaurantCard;
