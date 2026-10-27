const captainRoutes = require("express").Router();
const {body} = require("express-validator");
const captainController = require("../controllers/captainController");
const authMiddleware = require("../middleware/authMiddleware");
const captain = require("../models/captain");

captainRoutes.post("/signup", [
  body("name").isLength({min: 3}).withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
  body("phone").optional().trim().isLength({ min: 10, max: 15 }).withMessage("Phone number must be between 10 and 15 digits"),
  body("vehicle.color").notEmpty().withMessage("Vehicle color information is required"),
  body("vehicle.licensePlate").notEmpty().withMessage("Vehicle license plate information is required"),
  body("vehicle.capacity").isInt({ min: 1 }).withMessage("Vehicle capacity must be a positive integer"),
  body("vehicle.vehicleType").isIn(["car", "bike", "auto"]).withMessage("Vehicle type must be one of the following: car, bike, auto"),
  body("location").notEmpty().withMessage("Location information is required"),
], captainController.signupCaptain);


captainRoutes.post("/login", [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
], captainController.loginCaptain);

captainRoutes.get("/profile", authMiddleware.authCaptain, captainController.getCaptainProfile);

captainRoutes.post("/logout", authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = captainRoutes;

