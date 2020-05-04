import * as React from "react";
import SendingInvitations from "../components/SendingInvitations";
import ReceivedInvitations from "../components/ReceivedInvitations";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const InvitationsTopTabNavigator = (props) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: { backgroundColor: "dodgerblue" },
        style: { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
      }}
    >
      <Tab.Screen name="received" component={ReceivedInvitations} />
      <Tab.Screen name="sending" component={SendingInvitations} />
    </Tab.Navigator>
  );
};

export default InvitationsTopTabNavigator;
