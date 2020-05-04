import React, { Component } from "react";
import InvitationsContext from "../context/InvitationsContext";
import InvitationsTopTabNavigator from "../components/InvitationsTopTabNavigator";

class InvitationsScreen extends Component {
  constructor() {
    super();
    this.state = {
      pendingSending: "",
      pendingReceived: "",
      token: "",
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      const { pendingSending } = this.props.route.params;
      const { pendingReceived } = this.props.route.params;
      const { token } = this.props.route.params;

      this.setState({
        pendingReceived: pendingReceived,
        pendingSending: pendingSending,
        token: token,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <InvitationsContext.Provider
        value={{
          pendingSending: this.state.pendingSending,
          pendingReceived: this.state.pendingReceived,
          token: this.state.token,
        }}
      >
        <InvitationsTopTabNavigator />
      </InvitationsContext.Provider>
    );
  }
}

export default InvitationsScreen;
