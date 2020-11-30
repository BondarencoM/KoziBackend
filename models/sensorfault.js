const mongoose = require("mongoose");

const sensorFaultSchema = new mongoose.Schema({
    loc_x: Number,
    loc_y: Number,
    floor: Number,
    timestamp: {
        type: Date,
        required: true
    }
});


const SensorFault = mongoose.model("SensorFault", sensorFaultSchema, "sensorfaults")

module.exports ={SensorFault}