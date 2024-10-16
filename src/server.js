import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import MongoDatabase from './connectors/mongoDb.js';
import resolvers from "./graphql/resolvers/index.js";
import typeDefs from "./graphql/typeDefs/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// TODO :  add try catch?
const db = new MongoDatabase();
app.listen(PORT, () => {
  db.connect();
  console.log(`Server started at http:localhost:${PORT}`);
});

