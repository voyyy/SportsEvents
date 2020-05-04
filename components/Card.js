import React from "react";
import { StyleSheet, View } from "react-native";

const Card = props => {
  return (
    <View style={{ ...styles.card, ...props.style }} onPress={props.onPress}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "80%",
    elevation: 8,
    backgroundColor: "white",
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10
  }
});

export default Card;
