import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
} from "react-native";

import Input from "../components/Input";
import StyledButton from "../components/StyledButton";
import HideKeyboard from "../components/HideKeyboard";
import AuthContext from "../context/AuthContext";

const RegisterScreen = () => {
  const [name, setName] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [password2, setPassword2] = React.useState();
  const { signUp } = React.useContext(AuthContext);

  return (
    <HideKeyboard>
      <View style={styles.container}>
        <View style={styles.containerTextInput}>
          <View style={styles.containerTextInputWidth70}>
            <Input type="text" value={name} onChangeText={setName}>
              nick
            </Input>
            <Input type="email" value={email} onChangeText={setEmail}>
              email
            </Input>
            <Input
              secureTextEntry={true}
              type="password"
              value={password}
              onChangeText={setPassword}
            >
              password
            </Input>
            <Input
              secureTextEntry={true}
              type="password"
              value={password2}
              onChangeText={setPassword2}
            >
              confirm password
            </Input>
            <StyledButton
              onPress={() => signUp({ name, email, password, password2 })}
            >
              <Text style={styles.fontColor}>REGISTER</Text>
            </StyledButton>
          </View>
        </View>
      </View>
    </HideKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  containerTextInput: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  containerTextInputWidth70: {
    width: "70%",
  },
  fontColor: {
    color: "white",
  },
});

export default RegisterScreen;
