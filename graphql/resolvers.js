const { SensorFault } = require("../models/sensorfault");

module.exports = {
    Query: {
        MeanClimateMeasurements: (_, {start, stop}, { dataSources }) => dataSources.influx.getMeanClimateValues(start, stop),
        SensorFaults: (_, __, { dataSources }) => dataSources.mongodb.sensorFaultsFromToday(),
    },
  }