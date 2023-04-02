const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noticeSchema = new Schema(
  {
    noticeName: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("notice", noticeSchema);
