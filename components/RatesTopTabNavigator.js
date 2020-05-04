import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CategoryRates from "./CategoryRates";

const RatesTopTabNavigator = (props) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: { backgroundColor: "dodgerblue" },
        showIcon: true,
        showLabel: false,
        style: { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
      }}
    >
      <Tab.Screen
        name="basketball"
        component={CategoryRates}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/basketball.png")}
              style={styles.ballImage}
            />
          ),
        }}
        initialParams={{ category: "basketball" }}
      />
      <Tab.Screen
        name="football"
        component={CategoryRates}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/football.png")}
              style={styles.ballImage}
            />
          ),
        }}
        initialParams={{ category: "football" }}
      />
      <Tab.Screen
        name="volleyball"
        component={CategoryRates}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/volleyball.png")}
              style={styles.ballImage}
            />
          ),
        }}
        initialParams={{ category: "volleyball" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  ballImage: {
    width: 20,
    height: 20,
  },
});

export default RatesTopTabNavigator;
