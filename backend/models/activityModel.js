const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    activityName: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("activity", activitySchema);
