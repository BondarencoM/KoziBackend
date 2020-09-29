const { gql } = require('apollo-server')

// define Graphql schema
const typeDefs = gql`
type SensorMeasurement{
    floor: Int!
    loc_x: Int!
    loc_y: Int!
    temperature: Float!
    humidity: Float!    
}

type Query {
    MeanClimateMeasurements(start: String, stop: String): [SensorMeasurement]!
}
`

module.exports = typeDefs