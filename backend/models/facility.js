const mongoose = require("mongoose");

const Schema= mongoose.Schema;

const facilitySchema = new Schema(
    {
        roomFloor: {
            type:Number
        },
        roomName: {
            type:String
        },
        roomNumber: {
            type: String
        },
        x:{
            type: Number
        }, 
        y: {
            type: Number
        },
        active: {
            type: Boolean,
            default: true,
        },
        inUse: {
            type: Number
        },
        disableReason: {
            type: String
        },
        inUsePeople: {
            type: String
        },
        inUseStaff: {
            type: String
        },
        inUseElderly: {
            type: String
        },
    }, {timestamps: true}
)

module.exports = mongoose.model("facility", facilitySchema);