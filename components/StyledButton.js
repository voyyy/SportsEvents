import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

const StyledButton = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ ...styles.button, ...props.style }}
    >
      <View style={styles.buttonInside}>{props.children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    height: "20%",
    width: "100%",
  },
  buttonInside: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StyledButton;
