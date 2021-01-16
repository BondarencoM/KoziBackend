const setMaintenanceMode = async (_, { input }, { dataSources }) => {
  const { isInMaintenance } = input;
  const existingSensor = await dataSources.mongodb.getMaintenanceSensor(input);

  if (isInMaintenance && !existingSensor) {
    await dataSources.mongodb.addMaintenanceSensor(input);
    return true;
  }
  if (!isInMaintenance) {
    await dataSources.mongodb.removeMaintenanceSensor(input);
    return true;
  }
  return false;
};
const getAll = async (_, __, { dataSources }) =>
  await dataSources.mongodb.getAllMaintenanceSensors();

module.exports = { setMaintenanceMode, getAll };
