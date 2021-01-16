const { gql } = require('apollo-server');

// define Graphql schema
const typeDefs = gql`
  type SensorMeasurement {
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

  type SensorMaintenance {
    loc_x: Int!
    loc_y: Int!
    floor: Int!
  }

  type AuthenticationResponse {
    accessToken: String
    error: String
  }

  type Query {
    MeanClimateMeasurements(start: String, stop: String): [SensorMeasurement]!
    SensorFaults: [SensorFault!]!
    SensorMaintenance: [SensorMaintenance!]!
    Login(email: String, password: String): AuthenticationResponse
  }

  type Mutation {
    SetMaintenanceMode(input: MaintenanceInput!): Boolean
  }

  input MaintenanceInput {
    loc_x: Int!
    loc_y: Int!
    floor: Int!
    isInMaintenance: Boolean!
  }
`;

module.exports = typeDefs;
