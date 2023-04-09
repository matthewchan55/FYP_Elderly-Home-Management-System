const mongoose = require("mongoose");
//const autoIncrement = require("mongoose-sequence")(mongoose)
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
    age:{
      type: Number,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    address:{
      type: String,
    },
    // relative info
    relativesName: { type: String, },
    relativesPhone: { type: String, },
    relativesHKID: { type: String, },
    relativesAddress: {
      type: String,
    },    
    relativesEmail: {
      type: String,
    },
    // room info
    floor: {
      type: String,
    },
    zone: {
      type: String,
    },
    room: {
      type: String,
    },
    bed: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: String,
    },
    //routine & med info
    todayResidentRoutine: {
      type: Boolean,
      default: false,
    },
    todayMedicationRoutine: {
      type: Boolean,
      default: false,
    },
    defaultRoutineItems: {
      type: Array
    },
    defaultMedicationItems: {
      type: Array
    },
    medicalAppointmentInfo: {
      type: Array
    }
  },
  { timestamps: true }
);

residentInfoSchema.statics.checkCreateResident = async function (resInfo){
  const {residentID} = resInfo;

  if(!residentID){throw Error("An ID for the elderly is needed")}

  const exists = await this.findOne({residentID})

  if(exists){
    throw Error("This resident ID has already been registered")
  }

  const resident = await this.create(resInfo);
  return resident;
}


module.exports = mongoose.model("residentInfo", residentInfoSchema);