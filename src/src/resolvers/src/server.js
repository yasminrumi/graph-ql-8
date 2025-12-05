import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema/schema.js';
import { root } from './resolvers/resolvers.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  customFormatErrorFn: (error) => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
  })
}));

app.get('/', (req, res) => {
  res.send(`
    <h1>GraphQL API Server</h1>
    <p>Navigate to <a href="/graphql">/graphql</a> to access the GraphQL playground</p>
  `);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 GraphQL Server running at http://localhost:${PORT}/graphql`);
  console.log(`📚 GraphiQL UI available at http://localhost:${PORT}/graphql`);
});

export { app, server };