require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server-express');
const authenticateJWT = require('./middlewares/jwtAuth');
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
app.use(bodyParser.json());

server.applyMiddleware({ app });

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

app.get('/books', authenticateJWT, (req, res) => {
    res.json(books);
});

const users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, process.env.JWT_SIGNING_SECRET);

        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
