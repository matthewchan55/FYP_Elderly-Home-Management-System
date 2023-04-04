const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    activityName: {
      type: String,
    },
    activityCategory: {
      type: String,
    },
    activityFee:{
      type: Number
    },
    activityInvolvedStaff: {
      type: Array,
    },
    activityInvolvedEld: {
      type: Array,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    scheduled: {
      type: Boolean,
      default: false,
    },
    scheduledOn: {
      type: Number,
    },
    scheduledStartTime: {
      type: Date,
    },
    scheduledEndTime: {
      type: Date,
    },
    attendEld:{
      type: Number
    },
    absentEld:{
      type: Number
    },
    PIC:{
      type: String
    },
    floor:{
      type: String
    },
    room:{
      type: String
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("activity", activitySchema);
