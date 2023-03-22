const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rasSchema = new Schema(
  {
    residentID: {
      type: Number,
    },
    payDate: {
      type: Date,
    },
    deadlinePayDate: {
      type: Date,
    },
    payerName: {
      type: String,
    },
    payerContact: {
      type: String,
    },
    payerRelation: {
      type: String,
    },
    payType: {
      type: String,
    },
    payAmount: {
      type: Number,
    },
    payDescription: {
      type: String,
    },
    itemDescription: {
      type: Array,
    },
    transDate:{
      type:Date,
    },
    charge: {
      type: Array,
    },
    payment: {
      type: Array,
    },
    total: {
      type: Array,
    },
    paid:{
      type: Boolean,
      default: false,
    },
    received: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("residentAccountSummary", rasSchema);
