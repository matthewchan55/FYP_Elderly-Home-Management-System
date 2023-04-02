const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const calendarSchema = new Schema(
  {
    calendarItem: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("calendaritem", calendarSchema);
