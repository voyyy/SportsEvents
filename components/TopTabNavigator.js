import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ShowUpcomingEventsScreen from "../screens/ShowUpcomingEventsScreen";
import ShowOngoingEventsScreen from "../screens/ShowOngoingEventsScreen";
import ShowFinishedEventsScreen from "../screens/ShowFinishedEventsScreen";

const TopTabNavigator = (props) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: { backgroundColor: "dodgerblue" },
      }}
    >
      <Tab.Screen name="upcoming" component={ShowUpcomingEventsScreen} />
      <Tab.Screen name="ongoing" component={ShowOngoingEventsScreen} />
      <Tab.Screen name="finished" component={ShowFinishedEventsScreen} />
    </Tab.Navigator>
  );
};

export default TopTabNavigator;
