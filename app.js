const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
//generates schema
const { buildSchema } = require("graphql");
const app = express();

app.use(bodyParser.json());

//sets where to find schemas and resolvers
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]
        }
        type RootMutation {
            createEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //resolver functions:
    rootValue: {
      events: () => {
        return ["Romantic Cooking", "Sailing", "All night coding"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);
//sets port
app.listen(3000);
