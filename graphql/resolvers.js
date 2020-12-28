const { SensorFault } = require('../models/sensorfault');
const { login } = require('../services/userService');
const { setMaintenanceMode } = require('../services/maintenanceService');

module.exports = {
  Query: {
    MeanClimateMeasurements: (_, { start, stop }, { dataSources }) =>
      dataSources.influx.getMeanClimateValues(start, stop),
    SensorFaults: (_, __, { dataSources }) =>
      dataSources.mongodb.sensorFaultsFromToday(),
    Login: login,
  },
  Mutation: {
    SetMaintenanceMode: setMaintenanceMode,
  },
};
