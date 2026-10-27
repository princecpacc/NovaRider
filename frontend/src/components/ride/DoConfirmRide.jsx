import {
  ArrowLeft,
  ChevronRight,
  Banknote,
  MapPin,
} from "lucide-react";

export default function DoConfirmRide({
  pickup,
  destination,
  vehicle,
  fare,
  distanceKm,
  durationMinutes,
  onBack,
  onRequest,
  
}) {
  return (
    <div className="h-full overflow-y-auto px-4 pb-5 pt-2">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <button
          type="button"
          onClick={onBack}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-gray-100
            text-gray-700
            transition
            hover:bg-gray-200
            active:scale-95
          "
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-[14px] font-bold leading-relaxed text-gray-950">
          Confirm your ride
        </h2>

        {/* Keeps title centered */}

        <div className="h-9 w-9" />

      </div>


      {/* VEHICLE */}

      <div className="mt-3 flex flex-col items-center">

        <img
          src={vehicle?.image}
          alt={vehicle?.name || "Vehicle"}
          className="
            h-[65px]
            w-[100px]
            object-contain
          "
        />

        <h3 className="text-[13px] font-bold text-gray-950">
          Nova {vehicle?.name}
        </h3>

        <p className="text-[12px] text-gray-500">
          {vehicle?.id === "bike"
            ? "1 Seat"
            : vehicle?.id === "auto"
            ? "3 Seats"
            : "4 Seats"}

          {" • "}

          {vehicle?.id === "bike"
            ? "2 min away"
            : vehicle?.id === "auto"
            ? "4 min away"
            : "5 min away"}
        </p>
      </div>


      {/* ROUTE */}

      <div className="mt-3 space-y-3">

        {/* PICKUP */}

        <div className="flex items-start gap-3">

          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            
            <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">

              <div className="w-1 h-1 border-3 border-white rounded-full bg-white" />
            </div>
            
            
          </div>

          <div className="min-w-0 flex-1">


            <p className="mt-0.5 truncate text-[15px] font-semibold text-gray-900">
              {pickup}
            </p>

          </div>

        </div>


        {/* DESTINATION */}

        <div className="flex items-start gap-3">

          <div className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center">
            <MapPin
              size={17}
              strokeWidth={2.5}
              className="text-rose-500"
            />
          </div>

          <div className="min-w-0 flex-1">

    

            <p className="mt-0.5 truncate text-[15px] font-semibold text-gray-900">
              {destination}
            </p>

            <p className="mt-0.5 text-[13px] font-semibold text-gray-700">
            {distanceKm?.toFixed(1)} km
            {" • "}
            {durationMinutes} mins
          </p>

          </div>

        </div>

      </div>


      {/* TRIP + FARE */}

      <div
        className="
          mt-3
          flex
          items-center
          justify-between
          border-t
          border-gray-100
          pt-3
        "
      >

          
      <p className="text-[13px] font-medium tracking-wide text-gray-500">
            FARE ESTIMATE
          </p>



        {/* FARE */}


          

          <p className="mt-0.5 text-[15px] font-bold text-gray-950">
            ₹{fare}
          </p>

      

      </div>


      {/* PAYMENT */}

      <button
        type="button"
        className="
          mt-3
          flex
          w-full
          items-center
          justify-between
          rounded-xl
          px-1
          py-2
          transition
          hover:bg-gray-50
        "
      >

        <div className="flex items-center gap-2">

          <div
            className="
              flex
              h-7
              w-7
              
              items-center
              justify-center
              rounded-lg
              bg-green-50
            "
          >
            <Banknote
              size={18}
              strokeWidth={2.3}
              className="text-green-600"
            />
          </div>

          <div className="text-left">

            

            <p className="text-[15px] font-semibold text-gray-900">
              Cash
            </p>

          </div>

        </div>

        <ChevronRight
          size={18}
          strokeWidth={2.5}
          className="text-gray-400"
        />

      </button>


      {/* REQUEST BUTTON */}

      <button
        type="button"
        
        onClick={onRequest}
        className="
          mt-3
          w-full
          rounded-xl
          bg-rose-500
          py-3
          text-[12px]
          font-bold
          text-white
          shadow-sm
          transition
          hover:bg-rose-600
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:bg-gray-300
        "
      >
        Confirm Your Ride
      </button>

    </div>
  );
}