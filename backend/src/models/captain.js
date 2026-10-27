const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    socketId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "unavailable"],
      default: "unavailable"
    },
    vehicle:{
      color: { type: String, required: true },
      licensePlate: { type: String, required: true },
      capacity: { type: Number, required: true },
      vehicleType: { type: String, enum:["car", "bike", "auto"], required: true } 
    },
    location:{
      type: {
        type: String
        
    } 
  },
},
  {
    timestamps: true
  }
);

captainSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: "24h"});
  return token;
}

captainSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashedPassword = async function(password){
  return await bcrypt.hash(password, 10);
}

module.exports = mongoose.model("Captain", captainSchema);