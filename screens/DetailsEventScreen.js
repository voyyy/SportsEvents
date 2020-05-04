import React, { Component } from "react";
import { View, StyleSheet, Text, Image, ScrollView, Alert } from "react-native";
import axios from "axios";
import moment from "moment";

import Card from "../components/Card";
import StyledButton from "../components/StyledButton";
import TokenContext from "../context/TokenContext";
import DeleteEditEventButtons from "../components/DeleteEditEventButtons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "react-native-vector-icons";

class DetailsEventScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      userId: "",
      signedCount: "",
      interestedCount: "",
      signed: false,
      interested: false,
      eventStatus: "",
    };
    this.editEvent = this.editEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.interested = this.interested.bind(this);
    this.unInterested = this.unInterested.bind(this);
    this.signed = this.signed.bind(this);
    this.unSigned = this.unSigned.bind(this);
    this.interestedPersons = this.interestedPersons.bind(this);
    this.signedPersons = this.signedPersons.bind(this);
    this.upcoming = this.upcoming.bind(this);
    this.interestedButtons = this.interestedButtons.bind(this);
    this.newData = this.newData.bind(this);
  }

  upcoming() {
    if (this.state.userId == this.state.data.user) {
      this.props.navigation.setOptions({
        headerRight: () => (
          <DeleteEditEventButtons
            onPressEdit={this.editEvent}
            onPressDelete={this.deleteEvent}
          />
        ),
      });
    }
    if (this.state.data.signed.find((id) => id._id._id === this.state.userId)) {
      this.setState({ signed: true });
      this.setState({ interested: false });
    } else if (
      this.state.data.interested.find((id) => id._id._id === this.state.userId)
    ) {
      this.setState({ interested: true });
      this.setState({ signed: false });
    } else {
      this.setState({ interested: false });
      this.setState({ signed: false });
    }
    console.log(
      "signed: " + this.state.signed + " interested: " + this.state.interested
    );
  }

  componentDidMount = async () => {
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      const { eventId } = this.props.route.params;
      const { eventStatus } = this.props.route.params;
      let token = this.context;
      await axios
        .get(`http://c9892455.ngrok.io/api/event/single/${eventId}`)
        .then((res) => {
          this.setState({
            data: res.data,
          });
          this.setState({
            signedCount: this.state.data.signed.length,
            interestedCount: this.state.data.interested.length,
          });
        })
        .catch((error) => {
          console.log(
            "DetailsEventScreen (get event error): " +
              error.response.data.errors
          );
        });

      if (eventStatus == "upcoming") {
        await axios
          .get("http://c9892455.ngrok.io/api/auth", {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          })
          .then((res) => this.setState({ userId: res.data._id }))
          .catch((error) => {
            console.log(
              "DetailsEventScreen (get api auth error): " +
                error.response.data.msg
            );
          });
        this.upcoming();
        this.setState({
          eventStatus: "upcoming",
        });
      } else {
        this.setState({
          eventStatus: "ongoingOrfinished",
        });
      }
      console.log(
        "DetailsEventscreen (event status): " + this.state.eventStatus
      );
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  async newData() {
    await axios
      .get(`http://c9892455.ngrok.io/api/event/single/${this.state.data._id}`)
      .then((res) => {
        this.setState({
          data: res.data,
        });
        this.setState({
          signedCount: res.data.signed.length,
          interestedCount: res.data.interested.length,
        });
      })
      .catch((error) => {
        console.log(
          "DetailsEventScreen (get new data event error): " +
            error.response.data.msg
        );
      });
  }

  interested() {
    let token = this.context;
    axios
      .put(
        `http://c9892455.ngrok.io/api/event/${this.state.data._id}/interested`,
        {},
        {
          headers: { "Content-Type": "application/json", "auth-token": token },
        }
      )
      .then(() => {
        this.newData();
        this.setState({ interested: true, signed: false });
      })
      .catch((error) => {
        console.log(
          "DetailsEventScreen (put interested error): " +
            error.response.data.errors
        );
      });
  }

  unInterested() {
    let token = this.context;
    axios
      .put(
        `http://c9892455.ngrok.io/api/event/${this.state.data._id}/uninterested`,
        {},
        {
          headers: { "Content-Type": "application/json", "auth-token": token },
        }
      )
      .then(() => {
        this.newData();
        this.setState({ interested: false, signed: false });
      })
      .catch((error) => {
        console.log(
          "DetailsEventScreen (put uninterested error): " +
            error.response.data.errors
        );
      });
  }

  signed() {
    let token = this.context;
    axios
      .put(
        `http://c9892455.ngrok.io/api/event/${this.state.data._id}/signed`,
        {},
        {
          headers: { "Content-Type": "application/json", "auth-token": token },
        }
      )
      .then(() => {
        this.newData();
        this.setState({ interested: false, signed: true });
      })
      .catch((error) => {
        console.log(
          "DetailsEventScreen (put signed error): " + error.response.data.errors
        );
      });
  }

  unSigned() {
    let token = this.context;
    axios
      .put(
        `http://c9892455.ngrok.io/api/event/${this.state.data._id}/unsigned`,
        {},
        {
          headers: { "Content-Type": "application/json", "auth-token": token },
        }
      )
      .then(() => {
        this.newData();
        this.setState({ interested: false, signed: false });
      })
      .catch((error) => {
        console.log(
          "DetailsEventScreen (put unsigned error): " +
            error.response.data.errors
        );
      });
  }

  editEvent() {
    this.props.navigation.navigate("EditEvent", {
      data: this.state.data,
    });
  }

  deleteEvent() {
    let token = this.context;
    Alert.alert("Delete event", "Are you sure?", [
      {
        text: "Yes",
        onPress: () =>
          axios
            .delete(
              `http://c9892455.ngrok.io/api/event/${this.state.data._id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": token,
                },
              }
            )
            .then(() => {
              Alert.alert("Event deleted", " ", [{ text: "OK" }]);
              this.props.navigation.navigate("Events", { screen: "upcoming" });
            })
            .catch((error) => {
              console.log(
                "DetailsEventScreen (delete event error): " +
                  error.response.data.errors
              );
            }),
      },
      {
        text: "No",
      },
    ]);
  }

  signedPersons() {
    this.props.navigation.navigate("SignedOrInterestedPersons", {
      eventId: this.state.data._id,
      interestedOrSinged: "signed",
      data: this.state.data.signed,
    });
  }

  interestedPersons() {
    this.props.navigation.navigate("SignedOrInterestedPersons", {
      eventId: this.state.data._id,
      interestedOrSinged: "interested",
      data: this.state.data.interested,
    });
  }

  interestedButtons() {
    if (this.state.eventStatus == "upcoming") {
      if (!this.state.signed && !this.state.interested) {
        return (
          <StyledButton style={styles.button} onPress={this.interested}>
            <Text style={styles.fontColor}>Interested</Text>
          </StyledButton>
        );
      } else if (!this.state.signed && this.state.interested) {
        return (
          <StyledButton style={styles.button} onPress={this.unInterested}>
            <Text style={styles.fontColor}>Uninterested</Text>
          </StyledButton>
        );
      } else {
        return <Text />;
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 100,
            paddingTop: 20,
          }}
        >
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="calendar" size={36} />
            </View>
            <View style={styles.details}>
              <Text style={styles.font25}>
                {moment(this.state.data.date).format("YYYY-MM-DD")}
              </Text>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="clock-outline" size={36} />
            </View>
            <View style={styles.details}>
              <Text style={styles.font25}>TIME</Text>
              <View style={styles.rowDirection}>
                <Text style={styles.font20}>
                  {moment(this.state.data.startDate).format("HH:mm")}
                </Text>
                <Text style={styles.font20}> - </Text>
                <Text style={styles.font20}>
                  {moment(this.state.data.endDate).format("HH:mm")}
                </Text>
              </View>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="human-handsup" size={36} />
            </View>
            <View style={styles.details}>
              <View style={styles.rowDirection2}>
                <View>
                  <TouchableOpacity onPress={this.signedPersons}>
                    <Text style={styles.font15}>
                      JOINED ({this.state.signedCount})
                    </Text>
                  </TouchableOpacity>
                  <Text>max: {this.state.data.maxPlayers}</Text>
                  {!this.state.signed && this.state.eventStatus == "upcoming" && (
                    <StyledButton style={styles.button} onPress={this.signed}>
                      <Text style={styles.fontColor}>Join</Text>
                    </StyledButton>
                  )}
                  {this.state.signed && this.state.eventStatus == "upcoming" && (
                    <StyledButton style={styles.button} onPress={this.unSigned}>
                      <Text style={styles.fontColor}>Sign Out</Text>
                    </StyledButton>
                  )}
                </View>
                <View>
                  <TouchableOpacity onPress={this.interestedPersons}>
                    <Text style={styles.font15}>
                      INTERESTED ({this.state.interestedCount})
                    </Text>
                  </TouchableOpacity>
                  <Text />
                  {this.interestedButtons()}
                </View>
              </View>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="map-marker-outline" size={36} />
            </View>
            <View style={styles.details}>
              <View>
                <Text style={styles.font25}>{this.state.data.city}</Text>
              </View>
              <View>
                <Text style={styles.font20}>{this.state.data.street}</Text>
              </View>
            </View>
          </Card>
          {this.state.data.description ? (
            <Card style={styles.card}>
              <View style={styles.flex1}>
                <MaterialCommunityIcons name="card-text-outline" size={36} />
              </View>
              <View style={styles.details}>
                <Text style={styles.font15}>{this.state.data.description}</Text>
              </View>
            </Card>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}
DetailsEventScreen.contextType = TokenContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    padding: 10,
  },
  flex1: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageDetail: {
    marginLeft: 10,
    width: 40,
    height: 40,
  },
  details: {
    flex: 8,
    justifyContent: "center",
    alignContent: "space-around",
    marginLeft: 30,
  },
  font25: {
    fontSize: 25,
  },
  font20: {
    fontSize: 20,
  },
  font15: {
    fontSize: 15,
  },
  rowDirection: {
    flexDirection: "row",
  },
  rowDirection2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    height: 40,
    width: "80%",
  },
  fontColor: {
    color: "white",
  },
});

export default DetailsEventScreen;
