import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "./App";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  onError: ({ graphQLErrors }) => {
    alert(`A GraphQL Error occurred`);
    console.log("errors: ", graphQLErrors);
  }
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
