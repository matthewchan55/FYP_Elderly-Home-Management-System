const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todayWorkRecordsSchema = new Schema(
    {
      routineName: {
        type: String,
      },
      routinePerformer: {
        type: String,
      },
      routinePerformedBy: {
        type: String,
      },
      routineCategory: {
        type: String,
      },
      fixedTime: {
        type: Boolean,
      },
      routineComplete: {
        type: Array,
      },
      routineTotal: {
        type: Number,
      },
      routineDate:{
        type: Date,
      },
      toElderly: {
        type: Boolean
      },
      specialNeeded: {
        type: Boolean, 
        default: false,
      }
    },
    { timestamps: true }
  );


module.exports = mongoose.model("todayWorkRecord", todayWorkRecordsSchema);