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

scalar Date

type SensorFault {
    id: ID!
    loc_x: Int!
    loc_y: Int!
    floor: Int!
    timestamp: Date
    fault_code: String!
}

type Query {
    MeanClimateMeasurements(start: String, stop: String): [SensorMeasurement]!
    SensorFaults: [SensorFault!]!
}
`


module.exports = typeDefs