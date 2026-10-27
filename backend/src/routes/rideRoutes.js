const express = require("express");
const { body, param} = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const rideController = require("../controllers/rideController");

const rideRouter = express.Router();

rideRouter.post(
  "/create",
  authMiddleware.authUser,
  [
    body("pickup")
      .notEmpty()
      .withMessage("Pickup location is required"),

    body("destination")
      .notEmpty()
      .withMessage("Destination is required"),

    body("vehicleType")
      .isIn(["bike", "auto", "car"])
      .withMessage("Invalid vehicle type"),

    body("distanceKm")
      .isFloat({ min: 0 })
      .withMessage("Invalid distance"),

    body("durationMinutes")
      .isFloat({ min: 0 })
      .withMessage("Invalid duration"),
  ],
  rideController.createRide
);


rideRouter.get(
  "/history",
  authMiddleware.authUser,
  rideController.getRideHistory
);

rideRouter.get(
  "/available",
  authMiddleware.authCaptain,
  rideController.getAvailableRides
);

rideRouter.patch("/:rideId/accept", authMiddleware.authCaptain, rideController.acceptRide);

rideRouter.patch(
  "/:rideId/status",
  authMiddleware.authCaptain,
  [
    param("rideId")
      .isMongoId()
      .withMessage("Invalid ride ID"),

    body("status")
      .isIn(["arrived", "ongoing", "completed"])
      .withMessage("Invalid ride status"),
  ],
  rideController.updateRideStatus
);

rideRouter.post("/fare" , rideController.calculateFare);


rideRouter.post("/:rideId/verify-otp" , authMiddleware.authCaptain,  rideController.verifyRideOtp);



module.exports = rideRouter;