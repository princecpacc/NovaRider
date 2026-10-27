const { validationResult } = require("express-validator");
const crypto = require("crypto");

const Ride = require("../models/ride");
const rideService = require("../services/rideService");
const { emitRideToUser } = require("../socket");


module.exports.createRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const existingRide = await Ride.findOne({
      user: req.user._id,
      status: {
        $in: ["pending", "accepted", "arrived", "ongoing"],
      },
    });

    if (existingRide) {
      return res.status(409).json({
        success: false,
        message: "You already have an active ride"
      })
    }

    const {
  pickup,
  destination,
  vehicleType,
  distanceKm,
  durationMinutes,
} = req.body;

const distance = Number(distanceKm);
const duration = Number(durationMinutes);

if (
  !Number.isFinite(distance) ||
  !Number.isFinite(duration) ||
  distance <= 0 ||
  duration <= 0
) {
  return res.status(400).json({
    success: false,
    message: "Invalid distance or duration",
  });
}

const fare = rideService.getFare(
  vehicleType,
  distance,
  duration
);

const otp = crypto.randomInt(1000, 10000).toString();

console.log("otp:" , otp)

    const ride = await Ride.create({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
      fare,
      otp,
    });

    return res.status(201).json({
      success: true,
      message: "Ride requested successfully",
      ride,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getRideHistory = async (req, res, next) => {
  try {
    const rides = await Ride.find({
      user: req.user._id,
      status: {
        $in: ["completed", "cancelled"],
      },
    })
      .populate("captain", "name phone vehicle")
      .sort({ createdAt: -1 });

    if (!rides) {
      return res.status(200).json({
        success: true,
        message: "No ride found",
        ride: null,
      });
    }

    return res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAvailableRides = async (req, res, next) => {
  try {

    const rides = await Ride.find({
      status: "pending",
      captain: null,
      vehicleType: req.captain.vehicle.vehicleType,
    })
      .select("-otp")
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.acceptRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const activeRide = await Ride.findOne({
      captain: req.captain._id,
      status: {
        $in: ["accepted", "arrived", "ongoing"],
      },
    });

    if (activeRide) {
      return res.status(409).json({
        success: false,
        message: "You already have an active ride",
      });
    }

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        status: "pending",
        captain: null,
        vehicleType: req.captain.vehicle.vehicleType,
      },
      {
        $set: {
          captain: req.captain._id,
          status: "accepted",
        },
      },
      {
        new: true,
      }
    )
      .select("-otp")    
      .populate("user", "name phone")
      .populate("captain", "name phone vehicle");

    if (!ride) {
      return res.status(409).json({
        success: false,
        message: "this ride no longer available",
      })
    }

    await emitRideToUser(ride._id);

    return res.status(200).json({
      success: true,
      message: "Ride accepted successfully",
      ride,
    })

  } catch (err) {
    next(err);
  }
};

module.exports.updateRideStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { rideId } = req.params;
    const { status } = req.body;

    const ride = await Ride.findOne({
      _id: rideId,
      captain: req.captain._id,
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    const allowedTransitions = {
      accepted: "arrived",
      arrived: "ongoing",
      ongoing: "completed",
    };

    const nextStatus = allowedTransitions[ride.status];

    if (status !== nextStatus) {
      return res.status(409).json({
        success: false,
        message: `Ride cannot move from ${ride.status} to ${status}`,
      });
    }

    ride.status = status;

    if (status === "arrived") {
      ride.arrivedAt = new Date();
    }

    if (status === "ongoing") {
      if (!ride.otpVerified) {
    return res.status(403).json({
      success: false,
      message: "OTP verification required before starting ride",
    });
  }
      ride.startedAt = new Date();
    }

    if (status === "completed") {
      ride.completedAt = new Date();
    }

    await ride.save();

    await ride.populate("user", "name phone");

    await emitRideToUser(ride._id);

    return res.status(200).json({
      success: true,
      message: `Ride status updated to ${status}`,
      ride,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.calculateFare = async (req, res, next) => {
  try {
    const {
      distanceKm,
      durationMinutes,
    } = req.body;

    if (
      distanceKm === undefined ||
      durationMinutes === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "distanceKm and durationMinutes are required",
      });
    }

    const distance = Number(distanceKm);
    const duration = Number(durationMinutes);

    if (
      !Number.isFinite(distance) ||
      !Number.isFinite(duration) ||
      distance <= 0 ||
      duration <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid distance or duration",
      });
    }

    const fares = rideService.getAllFares(
      distance,
      duration
    );

    return res.status(200).json({
      success: true,
      fares,
    });

  } catch (error) {
    console.error(
      "FARE CALCULATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to calculate fare",
    });
  }
};

module.exports.verifyRideOtp = async (req, res, next) => {
  try{
    const {rideId} = req.params;
    const {otp} = req.body;
    
    if(!otp){
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      })
    }

    const ride = await Ride.findOne({
      _id: rideId,
      captain: req.captain._id,
      status: "arrived",
    });

    if(!ride){
      return res.status(400).json({
        success: false,
        message: "Ride not found or ride is not ready",
      })
    }

    console.log(ride);

    if(ride.otp !== String(otp)){
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      })
    }

    ride.otpVerified = true;
    ride.status = "ongoing";
    ride.startedAt = new Date();

    await ride.save();

    await ride.populate("user", "name phone")

    await emitRideToUser(ride._id);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      ride
    })

  } catch(error){
    next(error);
  }
}



