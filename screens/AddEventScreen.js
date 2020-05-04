import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import moment from "moment";
import Card from "../components/Card";
import Input from "../components/Input";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import StyledButton from "../components/StyledButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import TokenContext from "../context/TokenContext";
import PopUpMenu from "../components/PopUpMenu";

class AddEventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      dateBeforeFormat: new Date(),
      date: "PICK A DATE",
      timeFromBeforeFormat: new Date(),
      timeFrom: "FROM",
      timeToBeforeFormat: new Date(),
      timeTo: "",
      showDatePicker: false,
      showTimePickerFrom: false,
      city: "",
      street: "",
      maxPlayers: "",
      description: "",
      token: "",
    };
    this.onChangeDate = this.onChangeDate.bind(this);
    this.setDate = this.setDate.bind(this);
    this.onChangeTimeFrom = this.onChangeTimeFrom.bind(this);
    this.setTimeFrom = this.setTimeFrom.bind(this);
    this.submit = this.submit.bind(this);
    this.setHowLong = this.setHowLong.bind(this);
  }

  static contextType = TokenContext;

  onChangeDate(event, date) {
    this.setState({ showDatePicker: false });
    console.log(this.state.region);
    if (date) {
      this.setState({ dateBeforeFormat: date });
      this.setDate(this.state.dateBeforeFormat);
    }
  }

  onChangeTimeFrom(event, date) {
    this.setState({ showTimePickerFrom: false });
    if (date) {
      this.setState({ timeFromBeforeFormat: date });
      this.setTimeFrom(this.state.timeFromBeforeFormat);
    }
  }

  setDate(dateBeforeFormat) {
    this.setState({ date: moment(dateBeforeFormat).format("DD-MM-YYYY") });
  }

  setTimeFrom() {
    this.setState({
      timeFrom: moment(this.state.timeFromBeforeFormat).format("HH:mm"),
    });
  }

  setHowLong(m) {
    this.setState({ timeTo: m });
  }

  submit = async () => {
    const token = this.context;
    if (this.state.timeTo) {
      let startDate = moment(
        this.state.date + " " + this.state.timeFrom,
        "DD-MM-YYYY HH:mm"
      );
      let endDate = moment(startDate, "DD-MM-YYYY HH:mm").add(
        this.state.timeTo,
        "minutes"
      );
      await axios
        .post(
          "http://c9892455.ngrok.io/api/event",
          {
            category: this.state.category,
            startDate: startDate,
            endDate: endDate,
            city: this.state.city,
            street: this.state.street,
            maxPlayers: this.state.maxPlayers,
            description: this.state.description,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        )
        .then(() => {
          Alert.alert("Event added", " ", [{ text: "OK" }]);
          this.props.navigation.navigate("Events", { screen: "upcoming" });
        })
        .catch((error) => {
          if (error.response.data.errors) {
            Alert.alert(error.response.data.errors, " ", [{ text: "OK" }]);
          } else {
            Alert.alert(error.response.data.msg, " ", [{ text: "OK" }]);
          }
          console.log(
            "AddEventScreen (post error): " + error.response.data.msg
          );
        });
    } else {
      Alert.alert("Choose time", " ", [{ text: "OK" }]);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.showDatePicker && (
          <DateTimePicker
            value={this.state.dateBeforeFormat}
            minimumDate={new Date(Date.now())}
            mode="default"
            display="default"
            onChange={this.onChangeDate}
          />
        )}
        {this.state.showTimePickerFrom && (
          <DateTimePicker
            value={this.state.timeFromBeforeFormat}
            mode="time"
            display="default"
            is24Hour={true}
            onChange={this.onChangeTimeFrom}
          />
        )}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 100,
            paddingTop: 20,
            flexGrow: 1,
          }}
        >
          <Card style={styles.categoryConteiner}>
            <TouchableOpacity
              onPress={() => this.setState({ category: "basketball" })}
            >
              <View
                style={
                  this.state.category == "basketball"
                    ? styles.picked
                    : styles.unpicked
                }
              >
                <MaterialCommunityIcons name="basketball" size={60} />
              </View>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              onPress={() => this.setState({ category: "football" })}
            >
              <View
                style={
                  this.state.category == "football"
                    ? styles.picked
                    : styles.unpicked
                }
              >
                <MaterialCommunityIcons name="soccer" size={60} />
              </View>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              onPress={() => this.setState({ category: "volleyball" })}
            >
              <View
                style={
                  this.state.category == "volleyball"
                    ? styles.picked
                    : styles.unpicked
                }
              >
                <MaterialCommunityIcons name="volleyball" size={60} />
              </View>
            </TouchableOpacity>
          </Card>
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="calendar" size={36} />
            </View>
            <View style={styles.details}>
              <TouchableOpacity
                onPress={() => this.setState({ showDatePicker: true })}
              >
                <Text style={{ fontSize: 25 }}>{this.state.date}</Text>
              </TouchableOpacity>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="clock-outline" size={36} />
            </View>
            <View style={styles.details}>
              <Text style={{ fontSize: 25 }}>TIME</Text>
              <View style={styles.rowDirection2}>
                <TouchableOpacity
                  onPress={() => this.setState({ showTimePickerFrom: true })}
                >
                  <View>
                    <Text style={{ fontSize: 20 }}>{this.state.timeFrom}</Text>
                  </View>
                </TouchableOpacity>
                <Text style={{ fontSize: 20 }}> - </Text>
                <PopUpMenu onPress={this.setHowLong} />
              </View>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="map-marker-outline" size={36} />
            </View>
            <View style={styles.details}>
              <View>
                <Input
                  name="city"
                  onChangeText={(text) => this.setState({ city: text })}
                >
                  CITY
                </Input>
              </View>
              <View>
                <Input
                  name="street"
                  onChangeText={(text) => this.setState({ street: text })}
                >
                  STREET
                </Input>
              </View>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="human-handsup" size={36} />
            </View>
            <View style={styles.details}>
              <Input
                name="maxPlayers"
                onChangeText={(text) => this.setState({ maxPlayers: text })}
                keyboardType="number-pad"
              >
                MAX PLAYERS
              </Input>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={styles.flex1}>
              <MaterialCommunityIcons name="card-text-outline" size={36} />
            </View>
            <View style={styles.details}>
              <Input
                name="description"
                multiline={true}
                placeholder="Not required"
                onChangeText={(text) => this.setState({ description: text })}
              >
                Description
              </Input>
            </View>
          </Card>
          <StyledButton style={styles.button} onPress={() => this.submit()}>
            <Text style={{ color: "white" }}>ADD EVENT</Text>
          </StyledButton>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  flex1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: "10%",
    width: "80%",
  },
  details: {
    flex: 5,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 50,
  },
  categoryConteiner: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  card: {
    flexDirection: "row",
    padding: 10,
  },
  picked: {
    backgroundColor: "dodgerblue",
    borderRadius: 80,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  unpicked: {
    backgroundColor: "white",
    borderRadius: 80,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  rowDirection: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowDirection2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scrollView: {
    width: "100%",
  },
  line: {
    backgroundColor: "black",
    height: "80%",
    borderLeftWidth: 1,
  },
});

export default AddEventScreen;
