const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const Blacklist = require("../models/blacklist");

module.exports.signupUser = async (req, res) => {
  try{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(409).json({message: "User already exists"});
    }

    if(existingUser && existingUser.role != role){
      return res.status(400).json({message: `this account already exists with role ${existingUser.role}. Please use a different email or choose the correct role.`});
    }



    const hashedPassword = await User.hashedPassword(password);
    // const hashedPassword = await bcrypt.hash(password, 12);   // this is the same as the abovebut we have static method in user model so use it.

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "passenger"
    });

    const token = user.generateAuthToken();
    res.status(201).json({user, token});
  }
  catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`});
  }
}

// module.exports.loginUser = async (req, res) => {
//   try{
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//       return res.status(400).json({errors: errors.array()});
//     }
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//       return res.status(404).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await user.comparePassword(password);
//     // const isMtach = await bcrypt.compare(passworrd, user.password); // this is the same as the above but we have instance method in user model so use it.


//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }


//     const token = user.generateAuthToken();

//     res.cookie("token", token);
//     res.status(200).json({ user, token });
//   } catch(err){
//     console.error(err);
//     res.status(500).json({error: `Internal server error: ${err.message}`});
//   }
// }

module.exports.loginUser = async (req, res) => {
 

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

   

    const user = await User.findOne({ email }).select("+password");

    

    if (!user) {
      return res.status(404).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

   

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: `Internal server error: ${err.message}`,
    });
  }
};

module.exports.getUserProfile = async (req, res) => {
  try{
    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: req.user
    });
      } catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`}); 
      }
}

module.exports.logoutUser = async (req, res) => {
  try{
    res.clearCookie("token");
  
    
    await Blacklist.create({token: req.token});
    res.status(200).json({message: "User logged out successfully"});
  } catch(err){
    console.error(err);
    res.status(500).json({eroor: `Internal server error: ${err.message}`});
}

}