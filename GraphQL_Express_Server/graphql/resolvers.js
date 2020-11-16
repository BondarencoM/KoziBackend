const { SensorFault } = require("../models/sensorfault");

module.exports = {
    Query: {
        MeanClimateMeasurements: (_, {start, stop}, { dataSources }) => dataSources.influx.getMeanClimateValues(start, stop),
        SensorFaults: () => SensorFault.find({
            $and: [{
                    "timestamp": {
                        $gte: new Date - 1000 * 60 * 60 * 24
                    }
                },
                {
                    "timestamp": {
                        $lte: Date()
                    }
                }
            ]
        })
    },
  }