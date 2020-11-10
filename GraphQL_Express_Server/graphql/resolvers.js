const { sensorfault } = require("../models/sensorfault");

module.exports = {
    Query: {
        MeanClimateMeasurements: (_, {start, stop}, { dataSources }) => dataSources.influx.getMeanClimateValues(start, stop),
        sensorfaults: () => sensorfault.find()
    },
  }