module.exports = {
    Query: {
        MeanClimateMeasurements: (_, {start, stop}, { dataSources }) => dataSources.influx.getMeanClimateValues(start, stop),
    },
  }