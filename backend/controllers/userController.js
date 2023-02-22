const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")

// create jwt
const createToken = (_id) => {
  return jwt.sign({ _id }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: "1h" });
};

// login user
const loginUser = async (req, res) => {
  const { account, password } = req.body;

  try {
    const user = await User.login(account, password);

    const userID = user._id
    const token = createToken(userID)
    
    res.status(200).json({ ...user._doc, token});

  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// signup user
const signupUser = async (req, res) => {
  const { account, password, userType, staffID } = req.body;
 
  try {
    const user = await User.signup(account, password, userType, staffID);

    const userID = user._id
    const token = createToken(userID)

    res.status(200).json({ ...user._doc, token });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// fetch user profile
const updateProfileUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    {new: true}
  );

  if (!updatedUser) {
    return res.status(404).json({ error: "No such user" });
  }
  res.status(200).json(updatedUser);
}


// fetch staffs data
const fetchStaff = async(req, res) => {
  const staffs = await User.find().or([{userType: "admin"}, {userType: "caregivers"}]).sort({staffID: 1});
  res.status(200).json(staffs);
}

module.exports = { loginUser, signupUser, updateProfileUser, fetchStaff };
