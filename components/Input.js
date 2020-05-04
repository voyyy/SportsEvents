import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

const Input = props => {
  return (
    <View>
      <View style={styles.textAlign}>
        <Text style={styles.text}>{props.children}</Text>
      </View>
      <TextInput
        style={styles.textInput}
        value={props.value}
        onChangeText={props.onChangeText}
        name={props.name}
        type={props.type}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        multiline={props.multiline}
        placeholder={props.placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textAlign: {
    alignItems: "flex-start"
  },
  textInput: {
    borderBottomColor: "black",
    borderBottomWidth: 1
  },
  text: {
    fontSize: 20
  }
});

export default Input;
