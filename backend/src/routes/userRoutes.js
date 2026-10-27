const express = require("express");
const userRouter = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

userRouter.post("/signup",[
  body("name").isLength({min: 3}).withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
  body("role").optional().isIn(["passenger", "driver"]).withMessage("Role must be passenger or driver"),body("phone").optional().trim().isLength({ min: 10, max: 15 }).withMessage("Phone number must be between 10 and 15 digits"),
],userController.signupUser);

userRouter.post("/login",[
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
],userController.loginUser);

userRouter.get("/profile", authMiddleware.authUser , userController.getUserProfile);

userRouter.post("/logout", authMiddleware.authUser, userController.logoutUser);

module.exports = userRouter;  