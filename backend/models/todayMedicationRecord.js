const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todayMedicationRecordSchema = new Schema(
    {
      medicationComplete:{
        type: Array
      },
      medicationUpdatedBy: {
        type: String
      },
      medicationTotal: {
        type: Number
      },
      medicationDate: {
        type: Date
      },
      specialNeeded: {
        type: Boolean, 
        default: false,
      }

    },
    { timestamps: true }
  );


module.exports = mongoose.model("todayMedicationRecord", todayMedicationRecordSchema);