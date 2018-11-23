import React, { Fragment, Component } from "react";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";

const ADD_DAY_MUTATION = gql`
  mutation add {
    addDay(date: "", resort: "") {
      id
    }
  }
`;

export default class AddDayForm extends Component {
  state = {
    resort: "",
    date: new Date().toISOString().substring(0, 10),
    conditions: "POWDER",
    error: null
  };
  displayError = error => {
    this.setState({ error });
  };
  render() {
    return (
      <Fragment>
        <Mutation mutation={ADD_DAY_MUTATION} onError={this.displayError}>
          {mutation => <button onClick={mutation}>Add Day</button>}
        </Mutation>
        {this.state.error && (
          <p style={{ color: "red" }}>{this.state.error.message}</p>
        )}
      </Fragment>
    );
  }
}
