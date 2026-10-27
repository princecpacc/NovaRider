const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
      minlength: [3, 'name has must be at least 3 character'],
      trim: true,
    },

    email:{
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },


    socketId:{
      type:String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
  return token;
}

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashedPassword = async function(password){
  return await bcrypt.hash(password, 10);
}

module.exports = mongoose.model("User", userSchema);