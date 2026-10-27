import {
  ArrowLeft,
} from "lucide-react";
import VehicleCard from "./VehicleCard";


export default function VehiclePanel({
  fare,
  durationMinutes,
  distanceKm,
  selectedVehicle,
  setSelectedVehicle,
  onBack,
  onConfirm,
}) {

  const vehicles = [
    {
      id: "bike",
      name: "Nova Bike",
      subtitle: "2 min away",
      seats: 1,
      image: "/images/novaride-bike.png",
      fare: fare?.bike,
    },
    {
      id: "auto",
      name: "Nova Auto",
      subtitle: "4 min away",
      seats: 3,
      image: "/images/novaride-auto.png",
      fare: fare?.auto,
    },
    {
      id: "car",
      name: "Nova Go",
      subtitle: "5 min away",
      seats: 4,
      image: "/images/novaride-car.png",
      fare: fare?.car,
    },
  ];

  return (
    <div className="h-full overflow-y-auto px-5 pb-6 pt-3">

      {/* HEADER */}

      <div className="mb-5 flex items-center">

        <button
          type="button"
          onClick={onBack}
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-full
            bg-gray-100
            transition
            hover:bg-gray-200
            active:scale-95
          "
        >
          <ArrowLeft size={20} />
        </button>

        <div className="ml-3">

          <h1 className="text-xl font-bold text-gray-950">
            Choose a ride
          </h1>

          <p className="text-sm text-gray-500">
            Select your preferred vehicle
          </p>

        </div>

      </div>

      {/* ROUTE SUMMARY */}

      <div
        className="
          mb-4
          rounded-2xl
          bg-gray-50
          px-4 py-3
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-medium text-gray-400">
              TRIP
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {distanceKm?.toFixed(1)} km
            </p>

          </div>

          <div className="h-8 w-px bg-gray-200" />

          <div>

            <p className="text-xs font-medium text-gray-400">
              ETA
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {durationMinutes} min
            </p>

          </div>

        </div>

      </div>

      {/* VEHICLES */}

      <div className="space-y-3">

        {vehicles.map((vehicle) =>(

          <VehicleCard 
            key={vehicle.id}
            vehicle={vehicle}
            selected={vehicle.id === selectedVehicle}
            onSelect={()=> setSelectedVehicle(vehicle.id)}
          />
        ))}

      </div>

      {/* CONFIRM */}

      <button
        type="button"
        disabled={!selectedVehicle}
        onClick={() =>
          onConfirm(selectedVehicle)
        }
        className="
          mt-5
          w-full
          rounded-2xl
          bg-rose-500
          py-4
          text-[15px]
          font-semibold
          text-white
          transition
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:bg-gray-300
        "
      >
        Confirm {selectedVehicle
          ? selectedVehicle.charAt(0).toUpperCase() +
          selectedVehicle.slice(1)
          : "Ride"}
      </button>

    </div>
  );
}