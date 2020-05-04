import React, { Component } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import axios from "axios";
import moment from "moment";

import TokenContext from "../context/TokenContext";
import EventItem from "../components/EventItem";

class ShowOngoingEventsScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      refreshing: false,
    };
    this.onRefresh = this.onRefresh.bind(this);
    this.eventDetails = this.eventDetails.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      let token = this.context;
      console.log("token z showevents: " + token);
      await axios
        .get("http://c9892455.ngrok.io/api/event/ongoing", {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        })
        .then((res) => {
          this.setState({
            data: res.data,
          });
        })
        .catch((error) => {
          console.log(
            "ShowOngoingEventsScreen (get ongoing events error): " +
              error.response.data.errors
          );
        });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onRefresh() {
    this.componentDidMount();
  }

  eventDetails(evnId) {
    this.props.navigation.navigate("DetailsEvent", {
      eventId: evnId,
      eventStatus: "ongoing",
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.flatListContainer}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            style={styles.flatList}
            contentContainerStyle={{ alignItems: "center" }}
            data={this.state.data}
            renderItem={({ item }) => (
              <EventItem
                category={item.category}
                city={item.city}
                date={moment(item.startDate).format("DD-MM-YYYY")}
                startTime={moment(item.startDate).format("HH:mm")}
                finishTime={moment(item.endDate).format("HH:mm")}
                onPress={() => this.eventDetails(item._id)}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      </View>
    );
  }
}
ShowOngoingEventsScreen.contextType = TokenContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  flatListContainer: {
    flex: 6,
    width: "100%",
    flexDirection: "row",
  },
  flatList: {
    flex: 1,
    width: "100%",
  },
});

export default ShowOngoingEventsScreen;
