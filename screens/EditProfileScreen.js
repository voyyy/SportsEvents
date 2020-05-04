import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Alert, ScrollView } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import Card from "../components/Card";
import StyledButton from "../components/StyledButton";
import Input from "../components/Input";
import { MaterialCommunityIcons } from "react-native-vector-icons";

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nick: "",
      email: "",
      description: "",
      imageBase64: "",
      token: "",
      loggedUserId: "",
    };
    this.save = this.save.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      const { description } = this.props.route.params;
      const { imageBase64 } = this.props.route.params;
      const { token } = this.props.route.params;
      const { loggedUserId } = this.props.route.params;

      this.setState({
        description: description,
        imageBase64: imageBase64,
        token: token,
        loggedUserId: loggedUserId,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  pickPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      let newResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 100, height: 100 } }],
        {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      this.setState({ imageBase64: newResult.base64 });
    }
  };

  takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      let newResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 100, height: 100 } }],
        {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      this.setState({ imageBase64: newResult.base64 });
    }
  };

  deletePhoto() {
    this.setState({ imageBase64: "" });
  }

  save() {
    axios
      .put(
        `http://c9892455.ngrok.io/api/user/${this.state.loggedUserId}`,
        {
          name: this.state.nick,
          email: this.state.email,
          image: this.state.imageBase64,
          description: this.state.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .then(() => this.props.navigation.navigate("Profile"))
      .catch((error) => {
        if (error.response.data.errors) {
          Alert.alert(error.response.data.errors, " ", [{ text: "OK" }]);
        } else {
          Alert.alert(error.response.data.msg, " ", [{ text: "OK" }]);
        }
        console.log("EditProfile (put error): " + error.response.data.msg);
      });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardContainer}>
          <Card style={styles.cardImage}>
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
            <View style={styles.buttonContainer}>
              <StyledButton style={styles.button} onPress={this.pickPhoto}>
                <Text style={styles.fontColor}>PICK A PHOTO</Text>
              </StyledButton>
              <StyledButton style={styles.button} onPress={this.takePhoto}>
                <Text style={styles.fontColor}>TAKE A PHOTO</Text>
              </StyledButton>
            </View>
            {this.state.imageBase64 ? (
              <StyledButton
                style={styles.deleteButton}
                onPress={this.deletePhoto}
              >
                <Text style={styles.fontColor}>DELETE PHOTO</Text>
              </StyledButton>
            ) : null}
          </Card>
          <Card>
            <View style={styles.cardDescription}>
              <View style={styles.flex1}>
                <MaterialCommunityIcons name="account" size={26} />
              </View>
              <View style={styles.details}>
                <Input
                  name="nick"
                  value={this.state.nick}
                  onChangeText={(text) => this.setState({ nick: text })}
                >
                  new nick
                </Input>
              </View>
            </View>
            <View style={styles.cardDescription}>
              <View style={styles.flex1}>
                <MaterialCommunityIcons name="email-outline" size={26} />
              </View>
              <View style={styles.details}>
                <Input
                  name="email"
                  value={this.state.email}
                  onChangeText={(text) => this.setState({ email: text })}
                >
                  new email
                </Input>
              </View>
            </View>
          </Card>
          <Card style={styles.cardDescription}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="card-text-outline" size={36} />
            </View>
            <View style={styles.details}>
              <Input
                name="description"
                multiline={true}
                value={this.state.description}
                onChangeText={(text) => this.setState({ description: text })}
              >
                edit description
              </Input>
            </View>
          </Card>
          <StyledButton style={styles.saveButton} onPress={this.save}>
            <Text style={styles.fontColor}>SAVE</Text>
          </StyledButton>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 100,
  },
  cardImage: {
    height: 150,
    alignItems: "center",
    overflow: "visible",
    marginTop: 40,
  },
  cardContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    width: "100%",
  },
  button: {
    width: "40%",
    height: "50%",
  },
  deleteButton: {
    width: "40%",
    height: "15%",
    marginBottom: 5,
  },
  imageContainer: {
    marginTop: -30,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  flex1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 5,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 50,
  },
  cardDescription: {
    flexDirection: "row",
    padding: 10,
  },
  saveButton: {
    height: "10%",
    width: "80%",
  },
  fontColor: {
    color: "white",
  },
});

export default EditProfileScreen;
