import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const SignOutEditProfileButtons = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.onPressEdit}>
        <MaterialCommunityIcons
          name="pencil-outline"
          size={36}
          style={styles.image}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onPressSignOut}>
        <MaterialCommunityIcons name="logout" size={36} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    marginRight: 10,
  },
});

export default SignOutEditProfileButtons;
