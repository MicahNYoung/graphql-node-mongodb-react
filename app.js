const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
//generates schema
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");
const app = express();

app.use(bodyParser.json());

//sets where to find schemas and resolvers
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //resolver functions:
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              console.log(event);
              return { ...event._doc, _id: event.id };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            //returns only info related to the object and NOT meta data
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        return event;
      },
    },
    graphiql: true,
  })
);

//Get this from mongodb atlas => Database => Connect
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.eq0fa.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() =>
    //starts server at port 3000
    app.listen(3000)
  )
  .catch((err) => {
    console.log(err);
  });
