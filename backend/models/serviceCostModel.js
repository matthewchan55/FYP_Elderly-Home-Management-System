const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const serviceCostSchema = new Schema(
    {
    serviceName: {
        type:String
    },
    serviceCost: {
        type: Number
    },
    serviceCategory: {
        type: String
    }
    }, {timestamps: true}
)

module.exports = mongoose.model("servicescost", serviceCostSchema);