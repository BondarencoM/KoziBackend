const mongoose = require("mongoose");

const sensorFaultSchema = new mongoose.Schema({
    loc_x: Number,
    loc_y: Number,
    floor: Number,
    timestamp: { type: Date, default: Date.now }
});


const sensorfault = mongoose.model("sensorfault", sensorFaultSchema, "sensorfaults")

module.exports ={sensorfault}