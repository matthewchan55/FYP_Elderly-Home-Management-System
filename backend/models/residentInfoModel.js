const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const residentInfoSchema = new Schema(
  {
    residentID: {
      type: Number,
      unique: true,
      required: true,
    },
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    sex: {
      type: String,
    },
    HKID: {
      type: String,
    },
    relativesName: { type: String, },
    relativesPhone: { type: String, },
    relativesHKID: { type: String, },
    relativesAddress: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },

    updatedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("residentInfo", residentInfoSchema);