const { login } = require('../services/userService')
const {
  setMaintenanceMode,
  getAll,
} = require('../services/maintenanceService')

module.exports = {
  Query: {
    MeanClimateMeasurements: (_, { start, stop }, { dataSources }) =>
      dataSources.influx.getMeanClimateValues(start, stop),

    AllTemperatureMeasurements: (_, args, { dataSources }) =>
      dataSources.influx.getAllTemperatureValues(args),

    SensorFaults: (_, __, { dataSources }) =>
      dataSources.mongodb.sensorFaultsFromToday(),

    Login: login,
    SensorMaintenance: getAll,
  },
  Mutation: {
    SetMaintenanceMode: setMaintenanceMode,
  },
}
