const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Blacklist = require('../models/blacklist');
const Captain = require('../models/captain');

module.exports.authUser = async (req, res, next) => {
  try{
    console.log("AUTH USER MIDDLEWARE RUNNING");

    console.log("Authorization:", req.header("Authorization"));
console.log("Cookies:", req.cookies);
  
    const token = req.header('Authorization')?.split(" ")[1] || req.cookies?.token;
     console.log("TOKEN:", token);
    if(!token){
      console.log("NO TOKEN - BLOCKING REQUEST");
      return res.status(401).json({message: "authorization denied"});
    }

    const isBlacklisted = await Blacklist.findOne({token});
    if(isBlacklisted){
      return res.status(401).json({message: "authorization denied"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if(!user){
      return res.status(401).json({message: "User no longer exist"});
    }

    req.user = user;
    req.token = token;

    return next();
  } catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`});
  }
}

module.exports.authCaptain = async (req, res, next) => {
  try{
    const token = req.header('Authorization')?.split(" ")[1] || req.cookies?.token;
    if(!token){
      return res.status(401).json({message: "authorization denied"});
    }

    const isBlacklisted = await Blacklist.findOne({token});
    if(isBlacklisted){
      return res.status(401).json({message: "authorization denied"});
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await Captain.findById(decode._id);
    if(!captain){
      return res.status(401).json({message: "Captain not found"});
    }
    req.captain = captain;
    req.token = token;
    return next();
  } catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`});
  }
}