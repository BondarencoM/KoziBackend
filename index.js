require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const InfluxDataSource = require('./data_sources/InfluxdbDataSource')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const MongoDataSource = require('./data_sources/MongoDataSource')

const INFLUX_CONFIG = {
  url: process.env.INFLUX_HOST,
  token: process.env.INFLUX_TOKEN,
  organization: process.env.INFLUX_ORGANIZATION,
  bucket: process.env.INFLUX_BUCKET,
}

const MONGO_CONFIG = {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DB: process.env.MONGO_DB,
  MONGO_HOST: process.env.MONGO_HOST,
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    mongodb: new MongoDataSource(MONGO_CONFIG),
    influx: new InfluxDataSource(INFLUX_CONFIG),
  })
})

const app = express()

server.applyMiddleware({ app })

const port = process.env.PORT || 4000

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
