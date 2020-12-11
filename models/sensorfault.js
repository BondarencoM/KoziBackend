const mongoose = require("mongoose")

const sensorFaultSchema = new mongoose.Schema({
    loc_x: Number,
    loc_y: Number,
    floor: Number,
    fault_code: String,
    timestamp: {
        type: Date,
        required: true
    }
})


const SensorFault = mongoose.model("SensorFault", sensorFaultSchema, "sensorfaults")

module.exports = { SensorFault }