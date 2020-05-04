import React from "react";
import { View, StyleSheet, Text } from "react-native";

import Input from "../components/Input";
import StyledButton from "../components/StyledButton";

const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text>logo</Text>
      </View>
      <View style={styles.containerTextInput}>
        <View style={styles.containerTextInputWidth70}>
          <Text style={styles.font}>Forgot your password?</Text>
          <Input>email</Input>
          <StyledButton>
            <Text>SEND EMAIL</Text>
          </StyledButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  logo: {
    flex: 3,
    backgroundColor: "pink"
  },
  containerTextInput: {
    flex: 5,
    alignItems: "center"
  },
  containerTextInputWidth70: {
    width: "70%"
  },
  font: {
    marginTop: 20,
    fontSize: 40
  }
});

export default ForgotPasswordScreen;
