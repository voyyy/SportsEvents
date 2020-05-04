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

import Card from "../components/Card";
import AuthContext from "../context/AuthContext";
import SignOutEditProfileButtons from "../components/SignOutEditProfileButtons";
import UserStatisticsTopTabNavigator from "../components/UserStatisticsTopTabNavigator";
import RatesContext from "../context/RatesContext";
import { MaterialCommunityIcons } from "react-native-vector-icons";

class ProfileScreen extends Component {
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
      avg: "",
      pendingSending: "",
      pendingReceived: "",
    };
    this.editProfile = this.editProfile.bind(this);
    this.friends = this.friends.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      let { signOut } = this.context;

      this.props.navigation.setOptions({
        headerRight: () => (
          <SignOutEditProfileButtons
            onPressSignOut={signOut}
            onPressEdit={this.editProfile}
          />
        ),
      });

      await AsyncStorage.getItem("auth-token").then((value) => {
        this.setState({ token: value });
      });

      await axios
        .get("http://c9892455.ngrok.io/api/auth", {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        })
        .then((res) => {
          this.setState({
            nick: res.data.name,
            email: res.data.email,
            description: res.data.description,
            userId: res.data._id,
            imageBase64: res.data.image,
            friends: res.data.friends,
            rates: res.data.rates,
            pendingSending: res.data.pendingInvitations.sending,
            pendingReceived: res.data.pendingInvitations.received,
          });
        })
        .catch((error) => {
          console.log(
            "ProfileScreen (get api/auth error): " + error.response.data.msg
          );
        });

      console.log("ProfileScreen (id logged user): " + this.state.userId);
      axios
        .get(`http://c9892455.ngrok.io/api/event/finished`, {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        })
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
        .catch((error) => {
          console.log(
            "ProfileScreen (get finished events error): " +
              error.response.data.msg
          );
        });
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
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  editProfile() {
    this.props.navigation.navigate("EditProfile", {
      nick: this.state.nick,
      email: this.state.email,
      description: this.state.description,
      imageBase64: this.state.imageBase64,
      token: this.state.token,
      loggedUserId: this.state.userId,
    });
  }

  friends() {
    this.props.navigation.navigate("Friends", {
      data: this.state.friends,
      loggedUserId: this.state.userId,
    });
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
              }}
            >
              <UserStatisticsTopTabNavigator />
            </RatesContext.Provider>
          ) : null}
        </View>
        <View
          style={{
            marginRight: 50,
            marginBottom: 80,
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Invitations", {
                pendingSending: this.state.pendingSending,
                token: this.state.token,
              })
            }
          >
            <View style={{ alignItems: "center" }}>
              <MaterialCommunityIcons name="email-outline" size={46} />
              <View style={styles.invitations}>
                <Text style={{ color: "white" }}>
                  {this.state.pendingSending.length +
                    this.state.pendingReceived.length}
                </Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 20 }}>Invites</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
ProfileScreen.contextType = AuthContext;

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
    justifyContent: "flex-start",
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
  invitations: {
    borderRadius: 15,
    backgroundColor: "dodgerblue",
    padding: 5,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -50,
    marginRight: -30,
  },
});

export default ProfileScreen;
