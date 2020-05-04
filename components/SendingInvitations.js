import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Card from "./Card";
import axios from "axios";
import InvitationsContext from "../context/InvitationsContext";
import { MaterialCommunityIcons } from "react-native-vector-icons";

class SendingInvitations extends Component {
  constructor() {
    super();
    this.state = {
      pendingSending: "",
      token: "",
    };
    this.newData = this.newData.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      const invitations = this.context;
      this.setState({
        pendingSending: invitations.pendingSending,
        token: invitations.token,
      });
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
          pendingSending: res.data.pendingInvitations.sending,
        });
      })
      .catch((error) => {
        console.log(
          "SendingInvitations (get api/auth error): " + error.response.data.msg
        );
      });
  }

  cancelRequest(id) {
    axios
      .delete(`http://c9892455.ngrok.io/api/user/${id}/addFriend`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": this.state.token,
        },
      })
      .then(() => this.newData())
      .catch((error) =>
        console.log(
          "SendingInvitations (cancelRequest error): " + error.response.data.msg
        )
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          contentContainerStyle={{ alignItems: "center" }}
          data={this.state.pendingSending}
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
                onPress={() => this.cancelRequest(item._id._id)}
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
SendingInvitations.contextType = InvitationsContext;

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

export default SendingInvitations;
