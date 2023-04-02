const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    noteName: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("note", noteSchema);
