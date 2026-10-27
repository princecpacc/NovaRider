const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const captainRouter = require("./routes/captainRoutes");
const rideRouter = require("./routes/rideRoutes");
const locationRouter = require("./routes/locationRoutes");

const app = express();
app.use(cookieParser());

//middle ware
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res) => {
  res.send("Hello World")
});

app.use("/users", userRouter);
app.use("/captains", captainRouter);
app.use("/location", locationRouter)
app.use("/rides", rideRouter);



module.exports = app;