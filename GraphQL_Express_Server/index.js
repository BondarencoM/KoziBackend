require('dotenv').config()
const { ApolloServer } = require('apollo-server');
const InfluxDataSource = require('./data_sources/InfluxdbDataSource');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers')
const mongoose = require("mongoose");

const INFLUX_CONFIG = {    
  url: process.env.INFLUX_HOST, 
  token: process.env.INFLUX_TOKEN,
  organization: process.env.INFLUX_ORGANIZATION,
  bucket: process.env.INFLUX_BUCKET,
}

const {MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB,MONGO_URL} = process.env



const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({influx: new InfluxDataSource(INFLUX_CONFIG)})
});

if (mongoose.connection.readyState === 0 && !MONGO_URL) {
mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@kozi-main.o5ow5.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDb connected')
});
}

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}graphql`);
});