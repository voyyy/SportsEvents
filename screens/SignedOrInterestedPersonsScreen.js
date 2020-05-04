import React, { Component } from "react";
import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import axios from "axios";
import Card from "../components/Card";
import { TouchableOpacity } from "react-native-gesture-handler";
import TokenContext from "../context/TokenContext";

class SignedOrInterestedPersonsScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      const { interestedOrSinged } = this.props.route.params;
      const { data } = this.props.route.params;
      this.setState({ data: data });
      if (interestedOrSinged == "signed") {
        this.props.navigation.setOptions({
          title: "Signed",
        });
      } else {
        this.props.navigation.setOptions({
          title: "Interested",
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  goToProfile = async (id) => {
    let token = this.context;
    await axios
      .get("http://c9892455.ngrok.io/api/auth", {
        headers: { "Content-Type": "application/json", "auth-token": token },
      })
      .then((res) => {
        let loggedUserId = res.data._id;
        if (res.data._id == id) {
          this.props.navigation.navigate("Profile", {
            screen: "Profile",
          });
        } else {
          this.props.navigation.navigate("OtherProfile", {
            userId: id,
            loggedUserId: loggedUserId,
          });
        }
      })
      .catch((error) => {
        console.log(
          "SignedOrInterestedPersonsScreen (get api/auth error): " +
            error.response.data.errors
        );
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          contentContainerStyle={{ alignItems: "center" }}
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.goToProfile(item._id._id)}
            >
              <Card style={styles.card}>
                <View style={styles.imageContainer}>
                  {item._id.image ? (
                    <Image
                      source={{
                        uri: `data:image/gif;base64,${item._id.image}`,
                      }}
                      style={styles.image}
                    />
                  ) : (
                    <Image
                      source={require("../assets/defaultPhoto.png")}
                      style={styles.image}
                    />
                  )}
                </View>
                <View style={styles.name}>
                  <Text style={styles.font25}>{item._id.name}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id._id}
        />
      </View>
    );
  }
}
SignedOrInterestedPersonsScreen.contextType = TokenContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
    flex: 1,
  },
  cardContainer: {
    minWidth: "100%",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    padding: 10,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    flex: 8,
    justifyContent: "center",
    alignContent: "space-around",
    marginLeft: 50,
  },
});

export default SignedOrInterestedPersonsScreen;
