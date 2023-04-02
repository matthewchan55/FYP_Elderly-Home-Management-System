const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dietSchema = new Schema(
  {
    dietName: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("diet", dietSchema);
