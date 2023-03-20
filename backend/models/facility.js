const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const facilitySchema = new Schema(
  {
    roomFloor: {
      type: Number,
    },
    roomName: {
      type: String,
    },
    roomNumber: {
      type: String,
    },
    x: {
      type: Number,
    },
    y: {
      type: Number,
    },
    //active
    active: {
      type: Boolean,
      default: true,
    },
    //bedInUse
    bedInUse: {
      type: Boolean,
    },
    disableReason: {
      type: String,
    },
    disableStart: {
      type: Date,
    },
    disableEnd: {
      type: Date,
    },
    
    //booking
    allowBook: {
      type: Number,
    },
    bookedBy: {
      type: String,
    },
    bookedActivity: {
      type: String,
    },
    bookedStart: {
      type: Date,
    },
    bookedEnd: {
      type: Date,
    },
    invovledStaff: {
      type: String,
    },
    invovledElderly: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("facility", facilitySchema);
