const { DataSource } = require('apollo-datasource');
const { InfluxDB, flux, fluxDuration } = require('@influxdata/influxdb-client')
const SensorMeasurement = require('../models/SensorMeasurement')
const arrrayUtils = require('../utils/arrayUntils');
const { LoneSchemaDefinitionRule } = require('graphql');

class InfuxDataService extends DataSource {

    constructor({ url, token, organization, bucket }) {
        super()
        this.client = new InfluxDB({ url, token })
        this.queryApi = this.client.getQueryApi(organization)
        this.bucket = bucket
    }

    /**
     * @param {string} start start of the query interval, timestamp or realtive to now ('-5m' meaning five minutes ago)
     * @param {string} end end of the query interval, timestamp or relative to now, default is now
     * @returns {Promise<any[]>}
     */
    getMeanClimateValues(start = '-5m', end = '0m') {
        const query = flux`
        from(bucket: "${this.bucket}") 
        |> range(start: ${fluxDuration(start)}, stop: ${fluxDuration(end)})
        |> filter(fn: (r) => (r._measurement == "climate") 
                            and (r._field == "temperature" or r._field == "humidity")
                            and r.is_valid == "true" )
        |> mean()
        |> group(columns: ["floor", "loc_x", "loc_y"])
        `

        // executes thw querry
        // also coppies all the data into memory. On big queries consider using streaming (queryRows)
        return this.queryApi.collectRows(query)
            // group the result by the flux table, essentially bringing in the grouping from the flux query   
            .then(this.groupByTable)
            //groupBy returns a object, we're only interested in the values of that object (not the keys)
            .then(grouping => Object.values(grouping))
            //transform flux entries into SensorMeasurement objects
            .then(this.sensorReducer)
    }

    groupByTable(array) { 
        return arrrayUtils.groupBy(array, 'table') 
    }

    sensorReducer(measurements) {
        return measurements.map(m => new SensorMeasurement(m))
    }

}

module.exports = InfuxDataService
