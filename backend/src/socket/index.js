const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Captain = require("../models/captain");
const Blacklist = require("../models/blacklist");
const Ride = require("../models/ride");

const ACTIVE_RIDE_STATUSES = [
  "pending",
  "accepted",
  "arrived",
  "ongoing",
];

let io = null;

const getRideRoom = (rideId) => {
  return `ride:${rideId}`;
};

const RIDE_EVENT_BY_STATUS = {
  accepted: "ride:accepted",
  arrived: "ride:arrived",
  ongoing: "ride:otp-verified",
  completed: "ride:completed",
};

const emitRideToUser = async (rideId) => {
  if (!io || !rideId) {
    return;
  }

  const ride = await Ride.findById(rideId)
    .populate("captain", "name phone vehicle")
    .populate("user", "name phone socketId");

  if (!ride) {
    return;
  }

  const event = RIDE_EVENT_BY_STATUS[ride.status];

  if (!event) {
    return;
  }

  const userSocketId = ride.user?.socketId;

  if (!userSocketId) {
    return;
  }

  const payload = { ride };

  io.to(userSocketId).emit(event, payload);
  io.to(userSocketId).emit("ride:updated", payload);
};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // =====================================================
  // SOCKET AUTHENTICATION
  // =====================================================

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const role = socket.handshake.auth?.role;

      if (!token) {
        return next(
          new Error("Authentication token required")
        );
      }

      if (!role) {
        return next(
          new Error("Socket role required")
        );
      }

      const isBlacklisted =
        await Blacklist.findOne({ token });

      if (isBlacklisted) {
        return next(
          new Error("Token has been blacklisted")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // =================================================
      // USER
      // =================================================

      if (role === "user") {
        const user = await User.findById(
          decoded._id
        );

        if (!user) {
          return next(
            new Error("User not found")
          );
        }

        socket.user = user;
        socket.userId =
          user._id.toString();

        user.socketId = socket.id;

        await user.save();
      }

      // =================================================
      // CAPTAIN
      // =================================================

      else if (role === "captain") {
        const captain =
          await Captain.findById(decoded._id);

        if (!captain) {
          return next(
            new Error("Captain not found")
          );
        }

        socket.captain = captain;

        socket.captainId =
          captain._id.toString();

        captain.socketId =
          socket.id;

        await captain.save();
      }

      else {
        return next(
          new Error("Invalid socket role")
        );
      }

      next();

    } catch (error) {
      console.error(
        "SOCKET AUTH ERROR:",
        error.message
      );

      next(
        new Error(
          "Socket authentication failed"
        )
      );
    }
  });

  // =====================================================
  // CONNECTION
  // =====================================================

  io.on("connection", (socket) => {

    console.log("================================");
    console.log("SOCKET CONNECTED");
    console.log("socket.id:", socket.id);
    console.log(
      "userId:",
      socket.userId || "N/A"
    );
    console.log(
      "captainId:",
      socket.captainId || "N/A"
    );
    console.log("================================");


    // ===================================================
    // JOIN RIDE ROOM
    // ===================================================

    socket.on(
      "ride:join",
      async (rideId, callback) => {

        try {

          if (!rideId) {
            return callback?.({
              success: false,
              message:
                "Ride ID is required",
            });
          }

          const ride =
            await Ride.findById(rideId);

          if (!ride) {
            return callback?.({
              success: false,
              message:
                "Ride not found",
            });
          }

          if (
            !ACTIVE_RIDE_STATUSES.includes(
              ride.status
            )
          ) {
            return callback?.({
              success: false,
              message:
                "Ride is not active",
            });
          }

          // =============================================
          // USER AUTHORIZATION
          // =============================================

          if (socket.userId) {

            if (
              ride.user.toString() !==
              socket.userId
            ) {
              return callback?.({
                success: false,
                message:
                  "You are not authorized to join this ride",
              });
            }
          }

          // =============================================
          // CAPTAIN AUTHORIZATION
          // =============================================

          if (socket.captainId) {

            if (
              !ride.captain ||
              ride.captain.toString() !==
                socket.captainId
            ) {
              return callback?.({
                success: false,
                message:
                  "You are not authorized to join this ride",
              });
            }
          }

          const room =
            getRideRoom(rideId);

          await socket.join(room);

          console.log(
            `🏠 ${socket.id} joined ${room}`
          );

          return callback?.({
            success: true,
            message:
              "Joined ride room",
            room,
            rideId,
          });

        } catch (error) {

          console.error(
            "RIDE ROOM ERROR:",
            error
          );

          return callback?.({
            success: false,
            message:
              "Failed to join ride room",
          });
        }
      }
    );


    // ===================================================
    // CAPTAIN → USER
    // CAPTAIN GPS
    // ===================================================

    socket.on(
      "captain:location",
      async (location) => {

        try {

          if (!socket.captainId) {
            console.error(
              "Captain GPS from unauthenticated socket"
            );

            return;
          }

          // ---------------------------------------------
          // Validate coordinates
          // ---------------------------------------------

          if (
            typeof location?.latitude !==
              "number" ||
            typeof location?.longitude !==
              "number"
          ) {

            console.error(
              "Invalid captain location:",
              location
            );

            return;
          }

          if (
            location.latitude < -90 ||
            location.latitude > 90 ||
            location.longitude < -180 ||
            location.longitude > 180
          ) {

            console.error(
              "Captain coordinates out of range"
            );

            return;
          }

          const captainLocation = {
            latitude:
              location.latitude,

            longitude:
              location.longitude,

            accuracy:
              typeof location.accuracy ===
              "number"
                ? location.accuracy
                : null,

            timestamp: Date.now(),
          };

          // Save latest location
          socket.currentLocation =
            captainLocation;

          // ---------------------------------------------
          // Find active ride
          // ---------------------------------------------

          const activeRide =
            await Ride.findOne({
              captain:
                socket.captainId,

              status: {
                $in: [
                  "accepted",
                  "arrived",
                  "ongoing",
                ],
              },
            }).select(
              "_id user status"
            );

          if (!activeRide) {

            console.log(
              "Captain has no active ride"
            );

            return;
          }

          const room =
            getRideRoom(
              activeRide._id
            );

          console.log(
            "🚕 Captain GPS →",
            room,
            captainLocation
          );

          // Send to USER
          socket
            .to(room)
            .emit(
              "captain:location",
              captainLocation
            );

        } catch (error) {

          console.error(
            "CAPTAIN LOCATION ERROR:",
            error
          );
        }
      }
    );


    // ===================================================
    // USER → CAPTAIN
    // USER GPS
    // ===================================================

    socket.on(
      "user:location",
      async (location) => {

        try {

          if (!socket.userId) {
            console.error(
              "User GPS from unauthenticated socket"
            );

            return;
          }

          // ---------------------------------------------
          // Validate
          // ---------------------------------------------

          if (
            typeof location?.latitude !==
              "number" ||
            typeof location?.longitude !==
              "number"
          ) {

            console.error(
              "Invalid user location:",
              location
            );

            return;
          }

          if (
            location.latitude < -90 ||
            location.latitude > 90 ||
            location.longitude < -180 ||
            location.longitude > 180
          ) {

            console.error(
              "User coordinates out of range"
            );

            return;
          }

          const userLocation = {
            latitude:
              location.latitude,

            longitude:
              location.longitude,

            accuracy:
              typeof location.accuracy ===
              "number"
                ? location.accuracy
                : null,

            timestamp: Date.now(),
          };

          socket.currentLocation =
            userLocation;

          // ---------------------------------------------
          // Find active ride
          // ---------------------------------------------

          const activeRide =
            await Ride.findOne({
              user: socket.userId,

              status: {
                $in: [
                  "accepted",
                  "arrived",
                  "ongoing",
                ],
              },
            }).select(
              "_id captain status"
            );

          if (!activeRide) {
            return;
          }

          const room =
            getRideRoom(
              activeRide._id
            );

          console.log(
            "👤 User GPS →",
            room,
            userLocation
          );

          // Send to captain
          socket
            .to(room)
            .emit(
              "user:location",
              userLocation
            );

        } catch (error) {

          console.error(
            "USER LOCATION ERROR:",
            error
          );
        }
      }
    );


    // ===================================================
    // DISCONNECT
    // ===================================================

    socket.on(
      "disconnect",
      async (reason) => {

        console.log(
          "SOCKET DISCONNECTED:",
          socket.id,
          reason
        );

        try {

          if (socket.captainId) {

            await Captain.findOneAndUpdate(
              {
                _id:
                  socket.captainId,

                socketId:
                  socket.id,
              },
              {
                $unset: {
                  socketId: 1,
                },
              }
            );
          }

          if (socket.userId) {

            await User.findOneAndUpdate(
              {
                _id:
                  socket.userId,

                socketId:
                  socket.id,
              },
              {
                $unset: {
                  socketId: 1,
                },
              }
            );
          }

        } catch (error) {

          console.error(
            "DISCONNECT CLEANUP ERROR:",
            error
          );
        }
      }
    );
  });

  return io;
};

module.exports = initializeSocket;
module.exports.emitRideToUser = emitRideToUser;