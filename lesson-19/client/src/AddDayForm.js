import React, { Fragment, Component } from "react";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";

const CURRENT_DAYS_QUERY = gql`
  query {
    totalDays
    allDays {
      id
      date
      resort
      conditions
    }
  }
`;

const ADD_DAY_MUTATION = gql`
  mutation add($input: AddDayInput!) {
    addDay(input: $input) {
      id
      date
      resort
      conditions
    }
  }
`;

export default class AddDayForm extends Component {
  state = {
    resort: "",
    date: new Date().toISOString().substring(0, 10),
    conditions: "POWDER"
  };
  dayAdded = (client, { data, errors }) => {
    if (errors) {
      return console.error(errors);
    }

    let { allDays, totalDays } = client.readQuery({
      query: CURRENT_DAYS_QUERY
    });
    client.writeQuery({
      query: CURRENT_DAYS_QUERY,
      data: {
        totalDays: totalDays + 1,
        allDays: [...allDays, data.addDay]
      }
    });

    this.setState({
      resort: "",
      date: new Date().toISOString().substring(0, 10),
      conditions: "POWDER"
    });
  };
  render() {
    return (
      <Fragment>
        <input
          type="text"
          value={this.state.resort}
          onChange={e => this.setState({ resort: e.target.value })}
          placeholder="ski resort..."
        />
        <input
          type="date"
          value={this.state.date}
          onChange={e => this.setState({ date: e.target.value })}
        />
        <select onChange={e => this.setState({ conditions: e.target.value })}>
          {this.props.conditions.map(c => (
            <option key={c} value={c}>
              {c.toLowerCase()}
            </option>
          ))}
        </select>
        <Mutation mutation={ADD_DAY_MUTATION} update={this.dayAdded}>
          {mutation => (
            <button
              onClick={() => mutation({ variables: { input: this.state } })}
            >
              Add Day
            </button>
          )}
        </Mutation>
        {this.state.error && (
          <p style={{ color: "red" }}>{this.state.error.message}</p>
        )}
      </Fragment>
    );
  }
}
