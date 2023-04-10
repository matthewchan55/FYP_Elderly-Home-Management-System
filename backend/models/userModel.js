const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

//Define the property on each workout document
//when created, timestamp automatically generate
const userSchema = new Schema(
  {
    //personal info
    account: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    staffID: {
      type: Number,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNum: {
      type: String,
    },
    sex: {
      type: String,
    },
    HKID: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
    // work info
    pastWorkingAreaTime: {
      type: Array
    },
    workingShift: {
      type: String
    },
    workingArea: {
      type: Array
    },
    present: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (userInfo) {
  // Validation
  const { account, password, staffID } = userInfo;

  if (!account || !password) {
    throw Error("All fields must be filled");
  }

  const exists = await this.findOne({ account });

  if (exists) {
    throw Error("Account already in use");
  }

  const existStaffID = await this.findOne({ staffID });
  if (existStaffID) {
    throw Error("This staff already owns a account");
  }

  // Hashing 
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ ...userInfo, password: hash });

  return user;
};

// static login method
userSchema.statics.login = async function (account, password) {
  // Validation
  if (!account || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ account });
  if (!user) {
    throw Error("Invalid account or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Invalid account or password");
  }
  console.log(user);
  return user;
};

module.exports = mongoose.model("User", userSchema);
