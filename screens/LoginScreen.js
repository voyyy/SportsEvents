import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

import Input from "../components/Input";
import StyledButton from "../components/StyledButton";
import TokenContext from "../context/AuthContext";
import HideKeyboard from "../components/HideKeyboard";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const { signIn } = React.useContext(TokenContext);

  return (
    <HideKeyboard>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            source={require("../assets/logo.png")}
            //style={styles.logoImage}
          />
        </View>
        <View style={styles.containerTextInput}>
          <View style={styles.containerTextInputWidth70}>
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
            <View style={styles.textAlign2}>
              <Text>Forgot your password?</Text>
            </View>
            <StyledButton onPress={() => signIn({ email, password })}>
              <Text style={styles.fontColor}>LOGIN</Text>
            </StyledButton>
            <View style={styles.dont}>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text>Don't have an account? Sign up now!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.fbgContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/facebookLogo.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/googleLogo.png")}
              style={styles.image}
            />
          </View>
        </View> */}
      </View>
    </HideKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  logo: {
    marginTop: 50,
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  containerTextInput: {
    marginTop: -50,
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  containerTextInputWidth70: {
    width: "70%",
  },
  textAlign2: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  dont: {
    marginTop: 10,
    alignItems: "center",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  or: {
    marginLeft: "5%",
    marginRight: "5%",
  },
  line: {
    backgroundColor: "black",
    height: 1,
    width: "40%",
  },
  fbgContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    width: "40%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  fontColor: {
    color: "white",
  },
});

export default LoginScreen;
