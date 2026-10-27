import { useState, useEffect, useRef } from "react";
import CaptainHeader from "../../components/captain/CaptainHeader";
import CaptainStatusCard from "../../components/captain/CaptainStatusCard";
import CaptainBottomNav from "../../components/captain/CaptainBottomNav";
import RideRequestCard from "../../components/captain/RideRequestCard";
import CaptainActiveRide from "../../components/captain/CaptainActiveRide";
import {createSocket} from "../../services/socket"

import { getAvailableRides, acceptRide, updateRideStatus, verifyRideOtp } from "../../services/captainRide";

import MapView from "../../components/map/MapView";
const CaptainDashboard = () => {

  const audioRef = useRef(null);
  const seenRideIdsRef = useRef(new Set());
  const socketRef = useRef(null);


  const [isOnline, setIsOnline] = useState(false);
  const [rideRequest, setRideRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const [captainLocation, setCaptainLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [activeRide, setActiveRide] = useState(null);

  // socket connection
  useEffect(() => {

  const socket = createSocket("captain");
  socketRef.current = socket;

  socket.on("connect", () => {
    
    console.log("Captain Socket ID:", socket.id);

    if(activeRide?._id){
      socket.emit("ride:join", activeRide._id, (response)=> {
        console.log("captain room response", response);
      })
    }
    
  });

  socket.on(
  "user:location",
  (location) => {
    console.log(
      "👤 User location received:",
      location
    );

    setUserLocation({
      lat: Number(location.latitude),
      lng: Number(location.longitude),
      accuracy: location.accuracy,
      timestamp: location.timestamp,
    });
  }
);

  // captainLocation: validation, find ride, connect to room
//   socket.on("captain:location",
//   async (location) => {
//     try {
//       if (!socket.captainId) {
//         console.error(
//           "❌ GPS received from unauthenticated socket"
//         );
//         return;
//       }

//       if (
//         typeof location?.latitude !== "number" ||
//         typeof location?.longitude !== "number"
//       ) {
//         console.error(
//           "❌ Invalid captain GPS payload:",
//           location
//         );
//         return;
//       }

//       if (
//         location.latitude < -90 ||
//         location.latitude > 90 ||
//         location.longitude < -180 ||
//         location.longitude > 180
//       ) {
//         console.error(
//           "❌ Captain GPS out of range:",
//           location
//         );
//         return;
//       }

//       const captainLocation = {
//         latitude: location.latitude,
//         longitude: location.longitude,
//         accuracy:
//           typeof location.accuracy === "number"
//             ? location.accuracy
//             : null,
//         timestamp: Date.now(),
//       };

//       socket.currentLocation =
//         captainLocation;

//       console.log(
//         "📍 Captain GPS accepted:",
//         {
//           captainId: socket.captainId,
//           ...captainLocation,
//         }
//       );

//       const activeRide = await Ride.findOne({
//         captain: socket.captainId,
//         status: {
//           $in: [
//             "accepted",
//             "arrived",
//             "ongoing",
//           ],
//         },
//       }).select("_id user status");

//       if (!activeRide) {
//         console.log(
//           "ℹ️ Captain has no active ride"
//         );
//         return;
//       }

//       const rideRoom =
//         `ride:${activeRide._id}`;

//       console.log(
//         "🚕 Sending Captain location to:",
//         rideRoom
//       );

//       socket.to(rideRoom).emit(
//         "captain:location",
//         captainLocation
//       );
//     } catch (error) {
//       console.error(
//         "❌ Captain location handling failed:",
//         error.message
//       );
//     }
//   }
// );
  socket.on("connect_error", (error) => {
    console.error("CAPTAIN SOCKET ERROR:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("CAPTAIN SOCKET DISCONNECTED:", reason);
  });

  return () => {
    socket.disconnect();
    socketRef.current = null
  };
}, [activeRide?._id]);

 // captain Location
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


        // Captain's own map
        setCaptainLocation(
          location
        );


        // Send GPS to backend
        if (
          socketRef.current?.connected
        ) {

          socketRef.current.emit(
            "captain:location",
            location
          );

          console.log(
            "📡 CAPTAIN GPS SENT:",
            location
          );

        } else {

          console.log(
            "Captain socket not connected"
          );
        }
      },


      (error) => {

        console.error(
          "CAPTAIN GPS ERROR:",
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
      "🧹 Stopping Captain GPS"
    );

    navigator.geolocation
      .clearWatch(watchId);
  };

}, []);


  const handleToggleOnline = () => {
    const next = !isOnline;

    setIsOnline(next);

    console.log("Online status:", next);

    if (next && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;

          console.log("🔊 Audio unlocked successfully");
        })
        .catch((error) => {
          console.error("🔇 Could not unlock audio:", error);
        });
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      setLoading(true);

      const data = await acceptRide(rideId);

      console.log("RIDE ACCEPTED:", data);

      if (data.success) {
        setActiveRide(data.ride);
        setRideRequest(null);
        setTimeLeft(0);
      }

    } catch (error) {
      console.error("ACCEPT RIDE ERROR:", error);

    } finally {
      setLoading(false);
    }
  };

  const handleRejectRide = () => {
    setRideRequest(null);
    setTimeLeft(0);
  };

  const handleArrived = async () => {
    if (!activeRide) return;

    try {
      setLoading(true);

      const data = await updateRideStatus(activeRide._id, "arrived");

      console.log("CAPTSIN ARRIVED:", data);

      if (data.success) {
        setActiveRide(data.ride);
      }
    } catch (error) {
      console.error("ARRIVED ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleVerifyOtp = async (otp) => {
    if (!activeRide) return;

    try {
      setLoading(true);

      const data = await verifyRideOtp(activeRide._id, otp);

      if (data.success) {
        setActiveRide(data.ride);
        console.log("OTP VERIFIED")
      }
    } catch (error) {
      console.error("OTP VERIFICATION ERROR:", error);
      alert(error?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  const handleCompleteRide = async () => {
    if (!activeRide) return;

    try {
      setLoading(true);

      const data = await updateRideStatus(
        activeRide._id,
        "completed"
      );

      if (data.success) {
        setActiveRide(data.ride);
        setRideRequest(null);

        console.log("RIDE COMPLETED");
      }

    } catch (error) {
      console.error(
        "COMPLETE RIDE ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  // fetch bell sound
  useEffect(() => {
    audioRef.current = new Audio("/audio/new-request.mp3");

    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Ride audio
  useEffect(() => {
    if (!rideRequest) return;

    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = 0;

    audio.play()
      .then(() => {
        console.log("🔊 Bell started");
      })
      .catch((error) => {
        console.error("🔇 Audio blocked:", error);
      });

    const timeout = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 15000);

    return () => {
      clearTimeout(timeout);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [rideRequest]);

  // countdown
  useEffect(() => {
    if (!rideRequest || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [rideRequest, timeLeft]);

  // remove expired request
  useEffect(() => {
    if (!rideRequest) return;

    if (timeLeft === 0) {
      setRideRequest(null);
    }
  }, [timeLeft, rideRequest]);

  // getAvailableRides
  useEffect(() => {
    if (!isOnline || activeRide || rideRequest) {
      return;
    }

    const checkForRides = async () => {
      try {
        const data = await getAvailableRides();

        if (!data.success || !data.rides?.length) {
          return;
        }

        const nextRide = data.rides.find(
          (ride) =>
            !seenRideIdsRef.current.has(ride._id)
        );

        if (!nextRide) {
          return;
        }

        seenRideIdsRef.current.add(nextRide._id);

        setTimeLeft(15);
        setRideRequest(nextRide);

      } catch (error) {
        console.error(
          "AVAILABLE RIDES ERROR:",
          error
        );
      }
    };

    checkForRides();

    const interval = setInterval(
      checkForRides,
      5000
    );

    return () => clearInterval(interval);

  }, [isOnline, activeRide, rideRequest]);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative mx-auto  h-screen w-full max-w-107.5 overflow-hidden bg-white">

        {/* Map Area */}
        <MapView
  captainLocation={captainLocation}
  userLocation={userLocation}

  userVehicleType="car"
/>

        {/* Header */}
        <CaptainHeader isOnline={isOnline} />
        <CaptainStatusCard isOnline={isOnline} onToggleOnline={handleToggleOnline} />

        {/* BottomNavbar  */}
        <CaptainBottomNav />

        {activeRide &&
          ["accepted", "arrived", "ongoing", "completed"].includes(
            activeRide.status
          ) ? (
          <CaptainActiveRide
            ride={activeRide}
            onArrived={handleArrived}
            onVerifyOtp={handleVerifyOtp}
            onComplete={handleCompleteRide}
            loading={loading}
          />
        ) : (
          <RideRequestCard
            ride={rideRequest}
            timeLeft={timeLeft}
            onAccept={handleAcceptRide}
            onReject={handleRejectRide}
            loading={loading}
          />
        )}



      </div>
    </div>
  );
};

export default CaptainDashboard;