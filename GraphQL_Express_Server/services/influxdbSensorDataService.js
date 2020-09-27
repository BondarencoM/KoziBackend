const {InfluxDB, flux, fluxDuration} = require('@influxdata/influxdb-client')

const client = new InfluxDB({
  url: process.env.INFLUX_HOST,
  token: process.env.INFLUX_TOKEN,
})

const queryApi = client.getQueryApi(process.env.INFLUX_ORGANIZATION)

/**
 * @param {string} start start of the query interval, timestamp or realtive to now ('-5m' meaning five minutes ago)
 * @param {string} end end of the query interval, timestamp or relative to now, default is now
 * @returns {Promise<any[]>}
 */
function getMeanClimateValues(start = '-5m', end = '0m'){
  const query = flux`
  from(bucket: "${process.env.INFLUX_BUCKET}") 
    |> range(start: ${fluxDuration(start)}, stop: ${fluxDuration(end)})
    |> filter(fn: (r) => (r._measurement == "climate") and (r._field == "temperature" or r._field == "humidity"))
    |> mean()
    |> yield()
  `

  // coppies all the data into memory, be careful on big queries and use streaming (queryRows)
  return queryApi.collectRows(query)
}

module.exports = { getMeanClimateValues }

