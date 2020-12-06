require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server-express');
// const {authenticateJWT} = require('./middlewares/jwtAuth');
const express = require('express');
const InfluxDataSource = require('./data_sources/InfluxdbDataSource');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers')
const MongoDataSource = require('./data_sources/mongoDataSource');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

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
});

const app = express();

server.applyMiddleware({ app });

// Example how to use the middleware in speciifc routes
// app.get('/users', authenticateJWT, (req, res) => {
//     Do things
// });

const books = [
    {
        "author": "Chinua Achebe",
        "country": "Nigeria",
        "language": "English",
        "pages": 209,
        "title": "Things Fall Apart",
        "year": 1958
    },
    {
        "author": "Hans Christian Andersen",
        "country": "Denmark",
        "language": "Danish",
        "pages": 784,
        "title": "Fairy tales",
        "year": 1836
    },
    {
        "author": "Dante Alighieri",
        "country": "Italy",
        "language": "Italian",
        "pages": 928,
        "title": "The Divine Comedy",
        "year": 1315
    },
];

const accessTokenSecret = 'thisshouldbestoredintheenvbutisokayfornow';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.get('/books', authenticateJWT, (req, res) => {
    res.json(books);
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
