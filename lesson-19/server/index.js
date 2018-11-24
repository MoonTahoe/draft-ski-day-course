const { ApolloServer } = require("apollo-server");
const { generate } = require("shortid");
const { GraphQLScalarType } = require("graphql");

const typeDefs = `
    "A scalar type for parsing and serializing dates"
    scalar DateTime

    "An object that describes the characteristics of a ski day"
    type SkiDay {
        "A ski day's unique ID"
        id: ID!
        "The date that this ski day occurred"
        date: DateTime!
        "The resort where this ski day took place"
        resort: String!
        "The conditions at the resort on this particular ski day"
        conditions: Conditions
    }

    "A choice of options for conditions on a ski day"
    enum Conditions {
        "Fresh snow, either deep snow or packed powder"
        POWDER
        "Heavy warm wet snow that makes it hard to turn"
        HEAVY
        "Hard bulletproof ice, scary conditions on steep slopes"
        ICE
        "A little bit of snow. a lot of rocks, bushes, and trees."
        THIN
    }

    "The input type that is passed into the addDay mutation"
    input AddDayInput {
      "The date when the ski day occurred. If not provided, this value will be set to the datetime when the mutation is sent (i.e. Now)"
      date: DateTime
      "The resort where this ski day took place"
      resort: String!
      "The conditions at the resort on this particular ski day. Defaults to POWDER if no value provided"
      conditions: Conditions=POWDER
    }

    "This type will be returned after sending the removeDay mutation"
    type RemoveDayPayload {
      "A boolean value to confirm whether a day has been removed"
      removed: Boolean
      "The total number of days before the mutation was sent"
      totalBefore: Int
      "The current number of days after the mutation was sent"
      totalAfter: Int
      "The data for the removed ski day"
      day: SkiDay
    } 

    type Query {
        "Count of total days skied during a season"
        totalDays: Int
        "A list of all ski days that an individual has recorded this season"
        allDays: [SkiDay!]!
    }

    type Mutation {
        "Adds a day to a skier's total number of ski days during a season"
        addDay(input: AddDayInput!): SkiDay
        "Removes a day from a skier's total number of ski days during a season"
        removeDay(id: ID!): RemoveDayPayload!
    }
`;

let skiDays = [
  {
    id: "2WEKaVNO",
    date: "3/28/2019",
    resort: "Kirkwood",
    conditions: "POWDER"
  },
  {
    id: "hwX6aOr7",
    date: "1/2/2019",
    resort: "Jackson Hole",
    conditions: "POWDER"
  },
  {
    id: "a4vhAoFG",
    date: "11/23/2019",
    resort: "Alpine Meadows",
    conditions: "ICE"
  }
];

const resolvers = {
  Query: {
    totalDays: () => skiDays.length,
    allDays: () => skiDays
  },
  Mutation: {
    addDay: (parent, { input: { date, resort, conditions } }) => {
      if (resort === "") {
        throw new Error("The name of a ski resort must be provided");
      }

      if (!date) {
        date = new Date().toISOString();
      }

      let newDay = {
        id: generate(),
        date,
        resort,
        conditions
      };
      skiDays = [...skiDays, newDay];
      return newDay;
    },
    removeDay: (parent, { id }) => {
      const totalBefore = skiDays.length;
      const day = skiDays.find(day => day.id === id);
      let removed = false;

      if (day) {
        skiDays = skiDays.filter(day => day.id !== id);
        removed = true;
      }

      const totalAfter = skiDays.length;

      return {
        removed,
        totalBefore,
        totalAfter,
        day
      };
    }
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString().substring(0, 10),
    parseLiteral: ast => ast.value
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server
  .listen()
  .then(({ url }) => `GraphQL server listening on ${url}`)
  .then(console.log)
  .catch(console.error);
