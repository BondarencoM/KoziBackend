module.exports = class SensorTemperatureRecord {
    constructor(influxDatapoint) {
        this.value = influxDatapoint._value
        this.datetime = influxDatapoint._time
        this.is_valid = new Boolean(influxDatapoint.is_valid)
    }
}