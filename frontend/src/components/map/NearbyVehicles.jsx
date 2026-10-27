const vehicles = [
  {
    id: 1,
    type: "auto",
    image: "/images/novaride-auto.png",
    position: "top-[28%] left-[38%]",
    delay: "0s",
  },
  {
    id: 2,
    type: "car",
    image: "/images/novaride-car.png",
    position: "top-[42%] right-[27%]",
    delay: "1s",
  },
  {
    id: 3,
    type: "bike",
    image: "/images/novaride-bike.png",
    position: "top-[22%] right-[38%]",
    delay: "2s",
  },
  {
    id: 4,
    type: "auto",
    image: "/images/novaride-auto.png",
    position: "top-[55%] left-[28%]",
    delay: "1.5s",
  },
];

export default function NearbyVehicles({
  selectedVehicle,
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className={`
            absolute
            ${vehicle.position}
            transition-transform
            duration-700
          `}
          style={{
            animationDelay: vehicle.delay,
          }}
        >
          <div className="relative">

            {/* subtle vehicle glow */}

            <div
              className="
                absolute
                inset-0
                scale-125
                rounded-full
                bg-white/60
                blur-md
              "
            />

            {/* vehicle */}

            <div
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-lg
              "
            >
              <img
                src={vehicle.image}
                alt=""
                className="
                  h-7
                  w-7
                  object-contain
                "
              />
            </div>

          </div>
        </div>
      ))}

    </div>
  );
}