import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  AsyncStorage,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import axios from "axios";
import RatesTopTabNavigator from "../components/RatesTopTabNavigator";
import Card from "../components/Card";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import RatesContext from "../context/RatesContext";

class OtherProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nick: "",
      email: "",
      description: "",
      imageBase64: "",
      token: "",
      userId: "",
      basketball: "",
      volleyball: "",
      football: "",
      friends: "",
      rates: "",
      loggedUserId: "",
      avg: "",
      friend: "",
      pendingInvitations: "",
      pendingReceived: "",
      pendingSending: "",
    };
    this.newRates = this.newRates.bind(this);
    this.friends = this.friends.bind(this);
    this.friendButton = this.friendButton.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.acceptInvite = this.acceptInvite.bind(this);
    this.rejectInvite = this.rejectInvite.bind(this);
    this.newFriends = this.newFriends.bind(this);
    this.newAvg = this.newAvg.bind(this);
  }

  newAvg() {
    let basketballAvg = 0;
    let footballAvg = 0;
    let volleyballAvg = 0;
    if (this.state.rates.basketball.length > 0) {
      this.state.rates.basketball.forEach((element) => {
        basketballAvg += element.rate;
      });
      basketballAvg /= this.state.rates.basketball.length;
    }
    if (this.state.rates.football.length > 0) {
      this.state.rates.football.forEach((element) => {
        footballAvg += element.rate;
      });
      footballAvg /= this.state.rates.football.length;
    }
    if (this.state.rates.volleyball.length > 0) {
      this.state.rates.volleyball.forEach((element) => {
        volleyballAvg += element.rate;
      });
      volleyballAvg /= this.state.rates.volleyball.length;
    }
    this.setState({
      avg: ((basketballAvg + footballAvg + volleyballAvg) / 3).toFixed(1),
    });
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      const { userId } = this.props.route.params;
      const { loggedUserId } = this.props.route.params;

      await AsyncStorage.getItem("auth-token").then((value) => {
        this.setState({ token: value });
      });

      await axios
        .get(`http://c9892455.ngrok.io/api/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        })
        .then((res) =>
          this.setState({
            nick: res.data.name,
            imageBase64: res.data.image,
            userId: res.data._id,
            friends: res.data.friends,
            description: res.data.description,
            rates: res.data.rates,
            loggedUserId: loggedUserId,
            pendingInvitations: res.data.pendingInvitations,
          })
        )
        .catch((error) => {
          console.log(
            "OtherProfileScreen (get user/id error): " +
              error.response.data.errors
          );
        });
      console.log(
        "OtherProfileScreen (logged user id): " + this.state.loggedUserId
      );

      let friend = this.state.friends.some(
        (friend) => friend._id._id == this.state.loggedUserId
      );
      let pendingSending = this.state.pendingInvitations.sending.some(
        (pending) => pending._id === this.state.loggedUserId
      );

      let pendingReceived = this.state.pendingInvitations.received.some(
        (pending) => pending._id === this.state.loggedUserId
      );

      this.setState({
        friend: friend,
        pendingSending: pendingSending,
        pendingReceived: pendingReceived,
      });

      axios
        .get(
          `http://c9892455.ngrok.io/api/event/finished/${this.state.userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": this.state.token,
            },
          }
        )
        .then((res) => {
          const basketball = res.data.filter((x) => x.category == "basketball");
          const volleyball = res.data.filter((x) => x.category == "volleyball");
          const football = res.data.filter((x) => x.category == "football");
          this.setState({
            basketball: basketball,
            volleyball: volleyball,
            football: football,
          });
        })
        .then(() => this.newAvg())
        .catch((error) => {
          console.log(
            "OtherProfileScreen (get finished events error): " +
              error.response.data.errors
          );
        });
    });
  }

  async newRates() {
    await axios
      .get(`http://c9892455.ngrok.io/api/user/${this.state.userId}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": this.state.token,
        },
      })
      .then((res) =>
        this.setState({
          rates: res.data.rates,
        })
      )
      .then(() => this.newAvg())
      .catch((error) => {
        console.log(
          "OtherProfileScreen (get user/id error): " +
            error.response.data.errors
        );
      });
  }

  newFriends() {
    axios
      .get(`http://c9892455.ngrok.io/api/user/${this.state.userId}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": this.state.token,
        },
      })
      .then((res) =>
        this.setState({
          friends: res.data.friends,
        })
      )
      .catch((error) => {
        console.log(
          "OtherProfileScreen (get user/id new freinds error): " +
            error.response.data.msg
        );
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  sendRequest() {
    axios
      .post(
        `http://c9892455.ngrok.io/api/user/${this.state.userId}/addFriend`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .then(() =>
        this.setState({
          pendingReceived: true,
          friend: false,
          pendingSending: false,
        })
      )
      .catch((error) =>
        console.log(
          "OtherProfileScreen (sendRequest error): " + error.response.data.msg
        )
      );
  }

  cancelRequest() {
    axios
      .delete(
        `http://c9892455.ngrok.io/api/user/${this.state.userId}/addFriend`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .then(() =>
        this.setState({
          pendingReceived: false,
          friend: false,
          pendingSending: false,
        })
      )
      .catch((error) =>
        console.log(
          "OtherProfileScreen (cancelRequest error): " + error.response.data.msg
        )
      );
  }

  deleteFriend() {
    axios
      .delete(
        `http://c9892455.ngrok.io/api/user/${this.state.userId}/friend/remove`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .then(() =>
        this.setState({
          friend: false,
          pendingReceived: false,
          pendingSending: false,
        })
      )
      .then(() => this.newFriends())
      .catch((error) =>
        console.log(
          "OtherProfileScreen (deleteFriend error): " + error.response.data.msg
        )
      );
  }

  acceptInvite() {
    axios
      .post(
        `http://c9892455.ngrok.io/api/user/${this.state.userId}/addFriend/accept`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .then(() =>
        this.setState({
          pendingReceived: false,
          friend: true,
          pendingSending: false,
        })
      )
      .then(() => this.newFriends())
      .catch((error) =>
        console.log(
          "OtherProfileScreen (acceptFriend error): " + error.response.data.msg
        )
      );
  }

  rejectInvite() {
    axios
      .delete(
        `http://c9892455.ngrok.io/api/user/${this.state.userId}/addFriend/reject`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .then(() =>
        this.setState({
          pendingReceived: false,
          friend: false,
          pendingSending: false,
        })
      )
      .catch((error) =>
        console.log(
          "OtherProfileScreen (rejectFriendRequest error): " +
            error.response.data.msg
        )
      );
  }

  friends() {
    this.props.navigation.navigate("Friends", {
      data: this.state.friends,
      loggedUserId: this.state.loggedUserId,
    });
  }

  friendButton() {
    if (
      !this.state.friend &&
      !this.state.pendingReceived &&
      !this.state.pendingSending
    ) {
      return (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => this.sendRequest()}
        >
          <MaterialCommunityIcons name="account-plus-outline" size={26} />
          <Text> Friend Request</Text>
        </TouchableOpacity>
      );
    } else if (this.state.pendingReceived) {
      return (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => this.cancelRequest()}
        >
          <MaterialCommunityIcons name="account-minus-outline" size={26} />
          <Text> Cancel Request</Text>
        </TouchableOpacity>
      );
    } else if (this.state.friend) {
      return (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => this.deleteFriend()}
        >
          <MaterialCommunityIcons name="account-remove-outline" size={26} />
          <Text> Delete Friend</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => this.acceptInvite()}
          >
            <MaterialCommunityIcons name="account-plus-outline" size={26} />
            <Text> Accept friend invite</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => this.rejectInvite()}
          >
            <MaterialCommunityIcons name="account-minus-outline" size={26} />
            <Text> Reject friend invite</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Card style={styles.profileCard}>
            <View style={styles.topProfileCard}>
              <View style={styles.imageNickContainer}>
                <View style={styles.imageContainer}>
                  {this.state.imageBase64 ? (
                    <Image
                      source={{
                        uri: `data:image/gif;base64,${this.state.imageBase64}`,
                      }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={require("../assets/defaultPhoto.png")}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <Text style={{ fontSize: 20 }}>{this.state.nick}</Text>
              </View>
              <View style={styles.starsContainer}>
                <ImageBackground
                  source={require("../assets/stars.png")}
                  style={styles.stars}
                >
                  <Text style={{ fontSize: 35, fontWeight: "600" }}>
                    {this.state.avg}
                  </Text>
                </ImageBackground>
              </View>
            </View>
            {this.state.description ? (
              <View style={{ alignItems: "flex-start", width: "90%" }}>
                <Text>{this.state.description}</Text>
              </View>
            ) : null}
            <View style={styles.bottomProfileCard}>
              <TouchableOpacity onPress={() => this.friends()}>
                <Text>Friends ({this.state.friends.length})</Text>
              </TouchableOpacity>
              {this.friendButton()}
            </View>
          </Card>
        </View>
        <View style={styles.topTab}>
          {this.state.basketball ? (
            <RatesContext.Provider
              value={{
                finished: {
                  basketball: this.state.basketball,
                  volleyball: this.state.volleyball,
                  football: this.state.football,
                },
                rates: {
                  basketball: this.state.rates.basketball,
                  volleyball: this.state.rates.volleyball,
                  football: this.state.rates.football,
                },
                userId: this.state.userId,
                loggedUserId: this.state.loggedUserId,
                updateData: this.newRates,
              }}
            >
              <RatesTopTabNavigator />
            </RatesContext.Provider>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  imageNickContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  card: {
    overflow: "visible",
  },
  profileCard: {
    alignItems: "center",
    overflow: "visible",
    marginTop: 30,
  },
  topProfileCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
  },
  bottomProfileCard: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    padding: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    marginTop: -20,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  flexDirection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ballImage: {
    width: 40,
    height: 40,
  },
  starsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stars: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  topTab: {
    flex: 1,
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
  },
});

export default OtherProfileScreen;
