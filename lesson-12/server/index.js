const { ApolloServer } = require("apollo-server");
const { generate } = require("shortid");

const typeDefs = `
    "An object that describes the characteristics of a ski day"
    type SkiDay {
        "A ski day's unique ID"
        id: ID!
        "The date that this ski day occurred"
        date: String!
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

    type Query {
        "Count of total days skied during a season"
        totalDays: Int
        "A list of all ski days that an individual has recorded this season"
        allDays: [SkiDay!]!
    }

    type Mutation {
        "Adds a day to a skier's total number of ski days during a season"
        addDay(date: String! resort: String! conditions: Conditions): SkiDay
        "Removes a day from a skier's total number of ski days during a season"
        removeDay: Int
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
    addDay: (parent, { date, resort, conditions }) => {
      let newDay = {
        id: generate(),
        date,
        resort,
        conditions
      };
      skiDays = [...skiDays, newDay];
      return newDay;
    },
    removeDay: () => --skiDays
  }
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
