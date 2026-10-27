export default function VehicleCard({
  vehicle,
  selected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full
        rounded
        border
        p-8
        text-left
        transition-all
        duration-200
        ${
          selected
            ? "border-rose-500 bg-rose-50 shadow-md"
            : "border-black/10 bg-white hover:border-rose-300"
        }
      `}
    >
      <div className="flex items-center gap-4">

        {/* VEHICLE IMAGE */}

        <div className="flex h-16 w-20 items-center justify-center">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="max-h-16 max-w-20 object-contain"
          />
        </div>

        {/* INFORMATION */}

        <div className="min-w-0 flex-1">

          <div className=''>

            <h3 className="font-semibold text-black">
              {vehicle.name}
            </h3>

            <p className="mt-1 text-sm text-black/60">
            {vehicle.seats} Seats
          </p>

            <span className="text-lg font-bold text-black">
              ₹{vehicle.fare}
            </span>

          </div>

          

        </div>

        {/* SELECTED */}

        {selected && (
          <div
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-rose-500
              text-sm
              font-bold
              text-white
            "
          >
            ✓
          </div>
        )}

      </div>
    </button>
  );
}