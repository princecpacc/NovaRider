const Captain = require("../models/captain");
const {validationResult} = require("express-validator");
const Blacklist = require("../models/blacklist");

module.exports.signupCaptain = async (req, res) => {
  try{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }

    const {name , email, password, phone, vehicle, location} = req.body;

    const existingCaptain = await Captain.findOne({email});
    if(existingCaptain){
      return res.status(409).json({message: "Captain already exists"});
    }

    const hashedPassword = await Captain.hashedPassword(password);
    const captain = await Captain.create({
      name,
      email,
      password: hashedPassword,
      phone,
      vehicle,
      location
    });

    const token = captain.generateAuthToken();
    res.status(201).json({captain, token});
  } catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`});
  }
}

module.exports.loginCaptain = async (req, res) => {
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    const captain = await Captain.findOne({email}).select("+password");
    if(!captain){
      return res.status(404).json({message: "Invalid email or password"});
    }

    const isMatch = await captain.comparePassword(password);
    if(!isMatch){
      return res.status(401).json({message: "Invalid email or password"});
    }

    const token = captain.generateAuthToken();
    res.cookie("token", token)
    res.status(200).json({captain, token});
  } catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`});
  }
}

module.exports.getCaptainProfile = async (req, res) => {
  try{
    return res.status(200).json({
      success: true,
      message: "Captain profile fetched successfully",
      captain: req.captain
    });
      } catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`}); 
      }
}

module.exports.logoutCaptain = async (req, res) => {
  try{
    res.clearCookie("token");
    await Blacklist.create({token: req.token});
    return res.status(200).json({message: "Captain logged out successfully"});
  }
  catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`});
  }
}
