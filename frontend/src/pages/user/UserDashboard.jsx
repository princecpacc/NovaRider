import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";


import {
  User,
  LocateFixed,
  ChevronDown,
  Navigation,
  Home,
  Briefcase,
  Clock3,
  ChevronRight,
} from "lucide-react";


import Logo from "../../components/logo";
import MapView from "../../components/map/MapView";
import VehiclePanel from "../../components/ride/VehiclePanel";
import SearchPanel from "../../components/ride/SearchPanel";
import FindingRidePanel from "../../components/ride/FindingRidePanel"
import DoConfirmRide from "../../components/ride/DoConfirmRide"
import ConfirmedRidePanel from "../../components/ride/ConfirmedRidePanel";
import CaptainArrivedPanel from "../../components/ride/CaptainArrivedPanel";
import RideOngoingPanel from "../../components/ride/RideOngoingPanel";
import RideCompletedPanel from "../../components/ride/RideCompletedPanel";
import { searchLocation } from "../../services/location";
import { getRoute } from "../../services/route";
import { getFareEstimate } from "../../services/fare";
import { createRide, getCurrentRide } from "../../services/userRide";
import { createSocket } from "../../services/socket";
import {getLiveRoute,formatEta,} from "../../services/liveNavigation";

import {calculateDistanceMeters,} from "../../utils/location";



export default function UserDashboard() {
  const navigate = useNavigate();

  const vehicles = {
    bike: {
      id: "bike",
      name: "Bike",
      image: "/images/novaride-bike.png",
    },

    auto: {
      id: "auto",
      name: "Auto",
      image: "/images/novaride-auto.png",
    },

    car: {
      id: "car",
      name: "Car",
      image: "/images/novaride-car.png",
    },
  };

  const panelRef = useRef(null);
  const inputsRef = useRef(null);
  const lineRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchTimeout = useRef(null);
  const socketRef = useRef(null);

  const [liveRoute, setLiveRoute] =
  useState(null);

const [etaMinutes, setEtaMinutes] =
  useState(null);

const [routeDistanceKm, setRouteDistanceKm] =
  useState(null);

const routeAbortControllerRef =
  useRef(null);

const routeRequestIdRef =
  useRef(0);

const lastRouteLocationRef =
  useRef(null);

const lastRouteRequestTimeRef =
  useRef(0);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);

  const [activeInput, setActiveInput] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const [fare, setFare] = useState(null);
  const [fareError, setFareError] = useState(null);
  const [fareLoading, setFareLoading] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rideStage, setRideStage] = useState("search");

  const [creatingRide, setCreatingRide] = useState(false);

  const [activeRide, setActiveRide] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);

  // connect to socket
  useEffect(() => {
  const socket = createSocket("user");

  socketRef.current = socket;

  socket.on("connect", () => {
    console.log(
      "👤 User Socket ID:",
      socket.id
    );

    console.log(
      "👤 User socket connected:",
      socket.connected
    );
  });

  const applyRideUpdate = (payload) => {
    const ride = payload?.ride;

    if (!ride?._id) {
      return;
    }

    console.log("📡 USER RIDE UPDATE:", ride.status, ride);

    setActiveRide(ride);

    if (
      ["accepted", "arrived", "ongoing", "completed"].includes(
        ride.status
      )
    ) {
      setRideStage("accepted");
    }
  };

  socket.on("ride:accepted", applyRideUpdate);
  socket.on("ride:arrived", applyRideUpdate);
  socket.on("ride:otp-verified", applyRideUpdate);
  socket.on("ride:completed", applyRideUpdate);
  socket.on("ride:updated", applyRideUpdate);

  // Captain GPS received
  socket.on(
    "captain:location",
    (location) => {
      console.log(
        "🚕 Captain location received:",
        location
      );

      setCaptainLocation(
        location
      );
    }
  );

  socket.on(
    "connect_error",
    (error) => {
      console.error(
        "USER SOCKET ERROR:",
        error.message
      );
    }
  );

  socket.on(
    "disconnect",
    (reason) => {
      console.log(
        "USER SOCKET DISCONNECTED:",
        reason
      );
    }
  );

  return () => {
    console.log(
      "🧹 Cleaning User socket"
    );

    socket.off("ride:accepted", applyRideUpdate);
    socket.off("ride:arrived", applyRideUpdate);
    socket.off("ride:otp-verified", applyRideUpdate);
    socket.off("ride:completed", applyRideUpdate);
    socket.off("ride:updated", applyRideUpdate);

    socket.off(
      "captain:location"
    );

    socket.off(
      "connect_error"
    );

    socket.off(
      "disconnect"
    );

    socket.disconnect();

    socketRef.current = null;
  };
}, []);

useEffect(() => {
  if (!activeRide?._id) {
    return;
  }

  const socket =
    socketRef.current;

  if (!socket) {
    console.log(
      "⚠️ User socket not available"
    );
    return;
  }

  const joinRideRoom = () => {
    socket.emit(
      "ride:join",
      activeRide._id,
      (response) => {
        console.log(
          "🏠 USER RIDE ROOM RESPONSE:",
          response
        );
      }
    );
  };

  if (socket.connected) {
    joinRideRoom();
  } else {
    socket.once(
      "connect",
      joinRideRoom
    );
  }

  return () => {
    socket.off(
      "connect",
      joinRideRoom
    );
  };
}, [activeRide?._id]);

  // current location
  useEffect(() => {
  if (!navigator.geolocation) {
    console.error(
      "Geolocation is not supported by this browser"
    );
    return;
  }

  const watchId =
    navigator.geolocation.watchPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords;

        const location = {
          latitude,
          longitude,
          accuracy,
        };

        setUserLocation({
          lat: latitude,
          lng: longitude,
        });

        const socket =
          socketRef.current;

        if (
          socket?.connected &&
          activeRide?._id
        ) {
          socket.emit(
            "user:location",
            location
          );

          console.log(
            "📡 User location sent:",
            location
          );
        }
      },

      (error) => {
        console.error(
          "USER GPS ERROR:",
          error.message
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

  return () => {
    console.log(
      "🧹 Stopping User GPS tracking"
    );

    navigator.geolocation.clearWatch(
      watchId
    );
  };
}, [activeRide?._id]);


  // fetch Route
  useEffect(() => {
    let cancelled = false;

    async function fetchRoute() {
      console.log("ROUTE INPUT:", {
        pickupLocation,
        destinationLocation,
      });

      if (
        !pickupLocation ||
        !destinationLocation
      ) {
        setRoute(null);
        setRouteLoading(false);
        setRouteError(null);
        return;
      }

      setRouteLoading(true);
      setRouteError(null);

      try {
        const result = await getRoute(
          pickupLocation,
          destinationLocation
        );

        console.log(
          "USER DASHBOARD ROUTE RESULT:",
          result
        );

        if (cancelled) {
          return;
        }

        setRoute(result);

      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "ROUTE ERROR:",
          error
        );

        setRoute(null);


        setRouteError(
          error.message ||
          "Unable to find a route."
        );
      } finally {
        if (!cancelled) {
          setRouteLoading(false);
        }
      }
    }

    fetchRoute();

    return () => {
      cancelled = true;
    };
  }, [
    pickupLocation,
    destinationLocation,
  ]);

  // getFare
  useEffect(() => {
    if (!route) {
      return;
    }

    if (
      route.distanceKm === undefined ||
      route.durationMinutes === undefined
    ) {
      return;
    }

    async function calculateFare() {
      try {
        setFareLoading(true);
        setFareError(null);

        const result = await getFareEstimate({
          distanceKm: route.distanceKm,
          durationMinutes: route.durationMinutes,
        });

        console.log(
          "FARE RESPONSE:",
          result
        );

        setFare(result.fares);
        setSelectedVehicle(null);
        setRideStage("vehicle");
      } catch (error) {
        console.error(
          "FARE ERROR:",
          error
        );

        setFareError(
          error.message
        );
      } finally {
        setFareLoading(false);
      }
    }

    calculateFare();
  }, [route]);


  useEffect(() => {

  if (
    !activeRide?._id ||
    !captainLocation
  ) {
    return;
  }


  const activeStatuses = [
    "accepted",
    "arrived",
    "ongoing",
  ];


  if (
    !activeStatuses.includes(
      activeRide.status
    )
  ) {

    setLiveRoute(null);
    setEtaMinutes(null);
    setRouteDistanceKm(null);

    return;
  }


  const destination =
    getCaptainNavigationTarget();


  if (!destination) {
    return;
  }


  const currentLocation = {
    lat: Number(
      captainLocation.latitude
    ),

    lng: Number(
      captainLocation.longitude
    ),
  };


  const destinationLocationForRoute = {
    lat: Number(
      destination.lat
    ),

    lng: Number(
      destination.lng
    ),
  };


  // ================================================
  // Avoid invalid GPS
  // ================================================

  if (
    !Number.isFinite(
      currentLocation.lat
    ) ||
    !Number.isFinite(
      currentLocation.lng
    ) ||
    !Number.isFinite(
      destinationLocationForRoute.lat
    ) ||
    !Number.isFinite(
      destinationLocationForRoute.lng
    )
  ) {
    return;
  }


  // ================================================
  // Don't recalculate unnecessarily
  // ================================================

  const distanceMoved =
    calculateDistanceMeters(
      lastRouteLocationRef.current,
      currentLocation
    );


  const now =
    Date.now();


  const timeSinceLastRequest =
    now -
    lastRouteRequestTimeRef.current;


  const MIN_DISTANCE_METERS =
    40;


  const MIN_REQUEST_INTERVAL =
    8000;


  if (
    lastRouteLocationRef.current &&
    distanceMoved <
      MIN_DISTANCE_METERS &&
    timeSinceLastRequest <
      MIN_REQUEST_INTERVAL
  ) {
    return;
  }


  // ================================================
  // Cancel previous request
  // ================================================

  if (
    routeAbortControllerRef.current
  ) {

    routeAbortControllerRef.current.abort();
  }


  const controller =
    new AbortController();


  routeAbortControllerRef.current =
    controller;


  const requestId =
    ++routeRequestIdRef.current;


  lastRouteLocationRef.current =
    currentLocation;


  lastRouteRequestTimeRef.current =
    now;


  const updateRoute =
    async () => {

      try {

        const route =
          await getLiveRoute(
            currentLocation,
            destinationLocationForRoute,
            controller.signal
          );


        // ==========================================
        // Ignore old request
        // ==========================================

        if (
          requestId !==
          routeRequestIdRef.current
        ) {
          return;
        }


        setLiveRoute({
          coordinates:
            route.coordinates,
        });


        setEtaMinutes(
          route.durationMinutes
        );


        setRouteDistanceKm(
          route.distanceKm
        );


        console.log(
          "🗺️ LIVE ROUTE UPDATED",
          {
            eta:
              route.durationMinutes,

            distance:
              route.distanceKm,
          }
        );

      } catch (error) {

        if (
          error.name ===
          "AbortError"
        ) {
          return;
        }


        console.error(
          "LIVE ROUTE ERROR:",
          error
        );

        // IMPORTANT:
        // Don't destroy the previous route
        // when one request fails.

      }
    };


  updateRoute();


  return () => {

    if (
      routeAbortControllerRef.current ===
      controller
    ) {

      controller.abort();
    }
  };

}, [
  captainLocation,
  activeRide?._id,
  activeRide?.status,
  pickupLocation,
  destinationLocation,
]);

  
  // CURRENT RIDE 

// getCurrentRide
// GET CURRENT RIDE
useEffect(() => {
  if (!activeRide?._id) return;

  const checkRide = async () => {
    try {
      const data = await getCurrentRide();

      console.log("========== USER CURRENT RIDE ==========");
      console.log("API RESPONSE:", data);
      console.log("RIDE:", data?.ride);
      console.log("RIDE ID:", data?.ride?._id);
      console.log("RIDE STATUS:", data?.ride?.status);
      console.log("========================================");

      if (!data?.success || !data?.ride) {
        console.log("❌ No current ride returned");
        return;
      }

      setActiveRide(data.ride);

      // Keep rideStage only for panel animation
      if (data.ride.status === "accepted") {
        setRideStage("accepted");
      }

      if (data.ride.status === "arrived") {
        setRideStage("accepted");
      }

      if (data.ride.status === "ongoing") {
        setRideStage("accepted");
      }

    } catch (error) {
      console.error("CURRENT RIDE ERROR:", error);
    }
  };

  checkRide();

  const interval = setInterval(checkRide, 3000);

  return () => clearInterval(interval);
}, [activeRide?._id]);

  const handleInputFocus = (type) => {
    setActiveInput(type);
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setActiveInput(null);
  };

  const handleSuggestion = (place) => {
    if (!place || typeof place !== "object") {
      return;
    }

    const lat = Number(place.lat);
    const lng = Number(place.lng);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      console.error(
        "Invalid location suggestion:",
        place
      );

      return;
    }

    const location = {
      lat,
      lng,
    };

    if (activeInput === "pickup") {
      setPickup(place.name);
      setPickupLocation(location);

      setActiveInput("destination");
    } else {
      setDestination(place.name);
      setDestinationLocation(location);
    }

    setSuggestions([]);
  };

  const handleSearch = (value) => {
    clearTimeout(searchTimeout.current);

    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    searchTimeout.current =
      setTimeout(async () => {
        try {
          const result =
            await searchLocation(value);

          setSuggestions(result);
        } catch (error) {
          console.error(
            "Location search failed:",
            error
          );

          setSuggestions([]);
        }
      }, 400);
  };


  const getCaptainNavigationTarget = () => {

  if (!activeRide) {
    return null;
  }


  if (
    activeRide.status ===
      "accepted" ||
    activeRide.status ===
      "arrived"
  ) {

    return pickupLocation;
  }


  if (
    activeRide.status ===
    "ongoing"
  ) {

    return destinationLocation;
  }


  return null;
};

 

  const handleCurrentLocation = () => {

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };


        setUserLocation(location);

        setPickupLocation(location);

        setPickup("Current location");

        setActiveInput("destination");

      },

      (error) => {
        console.log(error);
      }

    );

  };

  const handleCreateRide = async () => {
    try {
      setCreatingRide(true);

      const data = await createRide({
        pickup: pickup,
        destination: destination,
        vehicleType: selectedVehicle,
        distanceKm: route?.distanceKm,
        durationMinutes: route?.durationMinutes,
      });

      console.log("RIDE CREATED:", data);

      if (data.success) {
        setActiveRide(data.ride);
        setRideStage("finding");
      }

    } catch (error) {
      console.error("CREATE RIDE ERROR:", error);
    } finally {
      setCreatingRide(false);
    }
  };



  /*
    Main animation
  */
  useGSAP(
    () => {
      if (!panelRef.current) return;

      // ==========================================
      // SEARCH SCREEN
      // ==========================================

      if (rideStage === "search") { 
        if (isExpanded) {
          gsap.to(panelRef.current, {
            height: "90vh",
            duration: 0.5,
            ease: "power3.out",
          });

          gsap.to(inputsRef.current, {
            gap: "18px",
            duration: 0.45,
            ease: "power3.out",
          });

          gsap.to(lineRef.current, {
            height: 52,
            duration: 0.45,
            ease: "power3.out",
          });

          gsap.fromTo(
            suggestionsRef.current,
            {
              opacity: 0,
              y: 25,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              delay: 0.15,
              ease: "power2.out",
            }
          );
        } else {
          gsap.to(panelRef.current, {
            height: 185,
            duration: 0.45,
            ease: "power3.out",
          });

          gsap.to(inputsRef.current, {
            gap: "8px",
            duration: 0.4,
            ease: "power3.out",
          });

          gsap.to(lineRef.current, {
            height: 29,
            duration: 0.4,
            ease: "power3.out",
          });
        }

        return;
      }

      // ==========================================
      // VEHICLE SELECTION
      // ==========================================

      if (rideStage === "vehicle") {
        gsap.to(panelRef.current, {
          height: "99vh",
          duration: 0.5,
          ease: "power3.out",
        });

        return;
      }

      // ==========================================
      // CONFIRM YOUR RIDE
      // ==========================================

      if (rideStage === "confirm") {
        gsap.to(panelRef.current, {
          height: "60vh",
          duration: 0.5,
          ease: "power3.out",
        });
      }

      // ==========================================
      // FINDING YOUR RIDE
      // ==========================================

      if (rideStage === "finding") {
        gsap.to(panelRef.current, {
          height: "86vh",
          duration: 0.5,
          ease: "power3.out",
        });
      }

      // ==========================================
// ACTIVE RIDE
// ==========================================

if (
  activeRide?.status === "accepted"
) {
  gsap.to(panelRef.current, {
    height: "40vh",
    duration: 0.5,
    ease: "power3.out",
  });

  return;
}

if (
  activeRide?.status === "arrived"
) {
  gsap.to(panelRef.current, {
    height: "50vh",
    duration: 0.5,
    ease: "power3.out",
  });

  return;
}

if (
  activeRide?.status === "ongoing"
) {
  gsap.to(panelRef.current, {
    height: "43vh",
    duration: 0.5,
    ease: "power3.out",
  });

  return;
}

if (
  activeRide?.status === "completed"
) {
  gsap.to(panelRef.current, {
    height: "70vh",
    duration: 0.5,
    ease: "power3.out",
  });

  return;
}
    },
    {
      dependencies: [isExpanded, rideStage, activeRide?.status,],
    }
  );

  return (
    <main className="relative h-screen w-full overflow-hidden bg-gray-100">

      {/* Map */}
      <MapView
  userLocation={userLocation}
  pickupLocation={pickupLocation}
  destinationLocation={destinationLocation}
  route={route}
  rideStage={rideStage}
  selectedVehicle={selectedVehicle}
  captainLocation={captainLocation}
  userVehicleType={selectedVehicle}
/>

      {routeLoading && (
        <div className="absolute bottom-32 left-4 z-50 rounded-xl bg-white px-4 py-3 shadow-lg">
          Finding route...
        </div>
      )}

      {routeError && (
        <div className="absolute bottom-32 left-4 z-50 rounded-xl bg-white px-4 py-3 text-red-500 shadow-lg">
          {routeError}
        </div>
      )}


      <div className="pointer-events-none absolute inset-0 bg-white/5" />


      {/* NovaRide logo */}

      <div className="absolute left-4 top-4 z-30">
        <Logo className="w-20" />
      </div>


      {/* Profile */}

      <button
        type="button"
        onClick={() =>
          navigate("/users/profile")
        }
        className="
          absolute
          right-4
          top-4
          z-30
          flex h-11 w-11
          items-center justify-center
          rounded-full
          bg-white
          shadow-lg
          transition
          active:scale-95
        "
      >
        <User size={20} />
      </button>


      {/* Current location button */}

      {/* {!isExpanded && (
        <button
          type="button"
          className="
            absolute
            bottom-[205px]
            right-4
            z-20
            flex h-12 w-12
            items-center justify-center
            rounded-full
            bg-white
            shadow-lg
            transition
            active:scale-95
          "
        >
          <LocateFixed size={21} />
        </button>
      )} */}


      {/* ================= BOTTOM SHEET ================= */}

      <section
        ref={panelRef}
        className="
          absolute
          bottom-0 left-0
          z-30
          h-[185px]
          w-full
          overflow-hidden
          rounded-t-[28px]
          bg-white
          shadow-[0_-10px_35px_rgba(0,0,0,0.14)]
        "
      >
        {/* Drag handle */}

        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-300" />

        {rideStage === "search" && (
          <SearchPanel
            pickup={pickup}
            destination={destination}
            activeInput={activeInput}
            setPickup={setPickup}
            setDestination={setDestination}
            handleInputFocus={handleInputFocus}
            handleSearch={handleSearch}
            suggestions={suggestions}
            handleSuggestion={handleSuggestion}
            isExpanded={isExpanded}
            handleCollapse={handleCollapse}
            handleCurrentLocation={handleCurrentLocation}
            inputsRef={inputsRef}
            lineRef={lineRef}
            suggestionsRef={suggestionsRef}
          />
        )}

        {rideStage === "vehicle" && fare && (
          <VehiclePanel
            fare={fare}
            durationMinutes={route?.durationMinutes}
            distanceKm={route?.distanceKm}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            onBack={() => {
              setRideStage("search");
              setFare(null);
              setSelectedVehicle(null);
            }}
            onConfirm={(vehicle) => {
              setSelectedVehicle(vehicle);

              // Stage 1 ends here
              setRideStage("confirm");
            }}
          />
        )}

        {rideStage === "confirm" && (
          <DoConfirmRide
            pickup={pickup}
            destination={destination}
            vehicle={vehicles[selectedVehicle]}
            fare={fare[selectedVehicle]}
            durationMinutes={route?.durationMinutes}
            distanceKm={route?.distanceKm}
            onBack={() => {
              setRideStage("vehicle");
            }}
            onRequest={handleCreateRide}

          />
        )}

        {rideStage === "finding" && selectedVehicle && (
          <FindingRidePanel
            vehicle={vehicles[selectedVehicle]}
            fare={fare[selectedVehicle]}
            onBack={() => setRideStage("vehicle")}
            onCancel={() => {
              setRideStage("vehicle")
              setActiveRide(null);
            }}
          />
        )}

        {activeRide?.status === "accepted" && (
          <ConfirmedRidePanel 
          ride={activeRide}
           />
        )}

        {activeRide?.status === "arrived" && (
  <CaptainArrivedPanel
    ride={activeRide}
  />
)}

{activeRide?.status === "ongoing" && (
  <RideOngoingPanel
    ride={activeRide}
  />
)}

{activeRide?.status === "completed" && (
  <RideCompletedPanel
    ride={activeRide}
    onDone={() => setActiveRide(null)}
  />
)}
      </section>





    </main>
  );
}




/* ===============================
   LOCATION INPUT
================================ */

function LocationInput({
  type,
  activeInput,
  value,
  placeholder,
  onFocus,
  onChange,
}) {
  const isActive =
    activeInput === type;

  return (
    <div
      className={`
        flex
        h-[48px]
        items-center
        gap-3
        rounded-xl
        border
        px-4
        transition-all
        duration-200

        ${isActive
          ? "border-rose-400 bg-white ring-2 ring-rose-100"
          : "border-transparent bg-gray-100"
        }
      `}
    >

      {type === "pickup" ? (
        <span className="h-3 w-3 shrink-0 rounded-full bg-rose-500" />
      ) : (
        <span className="h-3 w-3 shrink-0 bg-black" />
      )}

      <input
        type="text"
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          bg-transparent
          text-[15px]
          font-medium
          text-gray-950
          outline-none
          placeholder:font-normal
          placeholder:text-gray-500
        "
      />

    </div>
  );
}


/* ===============================
   SECTION TITLE
================================ */

function SectionTitle({ children }) {
  return (
    <p
      className="
        mb-1
        text-xs
        font-semibold
        uppercase
        tracking-[0.12em]
        text-gray-400
      "
    >
      {children}
    </p>
  );
}


/* ===============================
   SUGGESTION ITEM
================================ */

function SuggestionItem({
  icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex w-full
        items-center
        gap-3
        border-b
        border-gray-100
        py-3
        text-left
        transition
        hover:bg-gray-50
      "
    >

      <div
        className="
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-full
          bg-rose-50
          text-rose-500
        "
      >
        {icon}
      </div>


      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold text-gray-950">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-500">
          {subtitle}
        </p>

      </div>


      <ChevronRight
        size={17}
        className="text-gray-300"
      />

    </button>
  );
}