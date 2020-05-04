import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

import Card from "../components/Card";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const EventItem = (props) => {
  function switchResult(category) {
    switch (category) {
      case "football":
        return require("../assets/football.png");
      case "basketball":
        return require("../assets/basketball.png");
      case "volleyball":
        return require("../assets/volleyball.png");
    }
  }
  let ball = switchResult(props.category);
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.cardContainer}>
      <Card style={styles.card}>
        <View style={styles.ballContainer}>
          <Image source={ball} style={styles.ball} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.details}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} />
            <View style={styles.mLeft10}>
              <Text>{props.city}</Text>
            </View>
          </View>
          <View style={styles.details}>
            <MaterialCommunityIcons name="calendar" size={20} />
            <View style={styles.mLeft10}></View>
            <Text>{props.date}</Text>
          </View>
          <View style={styles.details}>
            <MaterialCommunityIcons name="clock-outline" size={20} />
            <View style={styles.mLeft10}>
              <Text>
                {props.startTime} - {props.finishTime}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
  },
  ballContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    width: 60,
    height: 60,
  },
  detailsContainer: {
    flexDirection: "column",
    flex: 5,
  },
  details: {
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
  },
  mLeft10: {
    marginLeft: 10,
  },
  cardContainer: {
    minWidth: "100%",
    alignItems: "center",
  },
});

export default EventItem;
