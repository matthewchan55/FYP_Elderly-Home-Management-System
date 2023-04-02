const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    galleryName: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("gallery", gallerySchema);
