const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const medicationSchema = new Schema(
  {
    genericName: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    productType: {
      type: String,
    },
    route: {
      type: String,
    },
    substanceName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    setDefaultTo: {
      type: Array,
    },
    shift: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("medication", medicationSchema);
