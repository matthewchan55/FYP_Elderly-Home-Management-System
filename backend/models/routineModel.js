const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const routineSchema = new Schema(
  {
    routineName: {
      type: String,
    },
    routineCategory: {
      type: String,
    },
    fixedTime: {
      type: Boolean,
    },
    fixedTimePeriod:{
        type: Array
    },
    setDefaultTo: {
      type: Array
    },
    createdBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("routine", routineSchema);