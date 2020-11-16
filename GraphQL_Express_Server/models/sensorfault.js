const mongoose = require("mongoose");

const sensorFaultSchema = new mongoose.Schema({
    loc_x: Number,
    loc_y: Number,
    floor: Number,
    timestamp: {
        type: Date,
        default: Date.now - 1000 * 60 * 60
    }
});


const SensorFault = mongoose.model("SensorFault", sensorFaultSchema, "sensorfaults")

module.exports ={SensorFault}