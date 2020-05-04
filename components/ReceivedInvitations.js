import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import Card from "./Card";
import axios from "axios";
import { MaterialCommunityIcons } from "react-native-vector-icons";

class ReceivedInvitations extends Component {
  constructor() {
    super();
    this.state = {
      pendingReceived: "",
      token: "",
    };
    this.newData = this.newData.bind(this);
    this.acceptInvite = this.acceptInvite.bind(this);
    this.rejectInvite = this.rejectInvite.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      await AsyncStorage.getItem("auth-token").then((value) => {
        this.setState({ token: value });
      });
      this.newData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  newData() {
    axios
      .get("http://c9892455.ngrok.io/api/auth", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": this.state.token,
        },
      })
      .then((res) => {
        this.setState({
          pendingReceived: res.data.pendingInvitations.received,
        });
      })
      .catch((error) => {
        console.log(
          "ReceivedInvitations (get api/auth error): " + error.response.data.msg
        );
      });
  }

  acceptInvite(id) {
    axios
      .post(
        `http://c9892455.ngrok.io/api/user/${id}/addFriend/accept`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .then(() => this.newData())
      .catch((error) =>
        console.log(
          "ReceivedInvitations (acceptFriend error): " + error.response.data.msg
        )
      );
  }

  rejectInvite(id) {
    axios
      .delete(`http://c9892455.ngrok.io/api/user/${id}/addFriend/reject`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": this.state.token,
        },
      })
      .then(() => this.newData())
      .catch((error) =>
        console.log(
          "ReceivedInvitations (rejectFriendRequest error): " +
            error.response.data.msg
        )
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          contentContainerStyle={{ alignItems: "center" }}
          data={this.state.pendingReceived}
          renderItem={({ item }) => (
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
              <TouchableOpacity
                onPress={() => this.acceptInvite(item._id._id)}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={46}
                  color={"green"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.rejectInvite(item._id._id)}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <MaterialCommunityIcons name="close" size={46} color={"red"} />
              </TouchableOpacity>
            </Card>
          )}
          keyExtractor={(item) => item._id._id}
        />
      </View>
    );
  }
}

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

export default ReceivedInvitations;
