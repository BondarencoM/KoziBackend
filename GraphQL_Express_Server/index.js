require('dotenv').config()
const { ApolloServer } = require('apollo-server');
const InfluxDataSource = require('./data_sources/InfluxdbDataSource');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers')

const INFLUX_CONFIG = {    
  url: process.env.INFLUX_HOST, 
  token: process.env.INFLUX_TOKEN,
  organization: process.env.INFLUX_ORGANIZATION,
  bucket: process.env.INFLUX_BUCKET,
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({influx: new InfluxDataSource(INFLUX_CONFIG)})
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}graphql`);
});