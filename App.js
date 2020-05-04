import * as React from "react";
import { AsyncStorage, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AuthContext from "./context/AuthContext";
import TokenContext from "./context/TokenContext";
import LoadingScreen from "./screens/LoadingScreen";
import BottomTabNavigator from "./components/BottomTabNavigator";

const Stack = createStackNavigator();

export default function App() {
  const [jwToken, setJwToken] = React.useState();
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem("auth-token");
        setJwToken(userToken);
        console.log("user token: " + userToken);
      } catch (e) {
        Console.log(e);
      }
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        await axios
          .post("http://c9892455.ngrok.io/api/auth/login", {
            email: data.email,
            password: data.password,
          })
          .then((res) => {
            AsyncStorage.setItem("auth-token", res.data.token);
            setJwToken(res.data.token);
            dispatch({ type: "SIGN_IN", token: res.data.token });
          })
          .catch((error) => {
            if (error.response.data.errors) {
              Alert.alert(error.response.data.errors, " ", [{ text: "OK" }]);
            } else {
              Alert.alert(error.response.data.msg, " ", [{ text: "OK" }]);
            }
            console.log(
              "authContext (SignIn error): " + error.response.data.errors
            );
          });
      },
      signOut: () => {
        Alert.alert(" ", "Are you sure you want to log out?", [
          {
            text: "Yes",
            onPress: () => {
              AsyncStorage.removeItem("auth-token");
              dispatch({ type: "SIGN_OUT" });
            },
          },
          {
            text: "No",
          },
        ]);
      },

      signUp: async (data) => {
        if (data.password != data.password2) {
          alert("Passwords do not match");
        } else {
          await axios
            .post("http://c9892455.ngrok.io/api/auth", {
              name: data.name,
              email: data.email,
              password: data.password,
            })
            .then((res) => {
              AsyncStorage.setItem("auth-token", res.data.token);
              Alert.alert("Account created", " ", [{ text: "OK" }]);
              setJwToken(res.data.token);
              dispatch({ type: "SIGN_IN", token: res.data.token });
            })
            .catch((error) => {
              if (error.response.data.errors) {
                Alert.alert(error.response.data.errors, " ", [{ text: "OK" }]);
              } else {
                Alert.alert(error.response.data.msg, " ", [{ text: "OK" }]);
              }
              console.log(
                "authContext (SingUp error): " + error.response.data.errors
              );
            });
        }
      },
    }),
    []
  );

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <TokenContext.Provider value={jwToken}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator>
            {state.userToken == null ? (
              <>
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{
                    title: " ",
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Profile"
                  component={BottomTabNavigator}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </TokenContext.Provider>
  );
}
