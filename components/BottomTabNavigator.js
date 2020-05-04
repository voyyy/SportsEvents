import * as React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AddEventScreen from "../screens/AddEventScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import DetailsEventScreen from "../screens/DetailsEventScreen";
import EditEventScreen from "../screens/EditEventScreen";
import FriendsScreen from "../screens/FriendsScreen";
import SignedOrInterestedPersonsScreen from "../screens/SignedOrInterestedPersonsScreen";
import TopTabNavigator from "./TopTabNavigator";
import OtherProfileScreen from "../screens/OtherProfileScreen";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import InvitationsScreen from "../screens/InvitationsScreen";

const ProfileStack = createStackNavigator();
const EventsStack = createStackNavigator();
const AddEventStack = createStackNavigator();

function addEventStack() {
  return (
    <AddEventStack.Navigator>
      <AddEventStack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{
          title: "Add Event",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
    </AddEventStack.Navigator>
  );
}

function profileStack() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
      <ProfileStack.Screen
        name="OtherProfile"
        component={OtherProfileScreen}
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
      <ProfileStack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          title: "Friends",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
      <ProfileStack.Screen
        name="Invitations"
        component={InvitationsScreen}
        options={{
          title: "Invitations",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
    </ProfileStack.Navigator>
  );
}

function eventsStack() {
  return (
    <EventsStack.Navigator>
      <EventsStack.Screen
        name="Events"
        component={TopTabNavigator}
        options={{
          title: "Events",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
      <EventsStack.Screen
        name="DetailsEvent"
        component={DetailsEventScreen}
        options={{
          title: "Details",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
      <EventsStack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{
          title: "Edit Event",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 30,
          },
        }}
      />
      <EventsStack.Screen
        name="OtherProfile"
        component={OtherProfileScreen}
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
      <EventsStack.Screen
        name="SignedOrInterestedPersons"
        component={SignedOrInterestedPersonsScreen}
        options={{
          title: " ",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
      <EventsStack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          title: "Friends",
          headerStyle: {
            backgroundColor: "dodgerblue",
          },
        }}
      />
    </EventsStack.Navigator>
  );
}

const BottomTabNavigator = (props) => {
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      barStyle={{ backgroundColor: "dodgerblue" }}
      inactiveColor="black"
      labeled="false"
    >
      <Tab.Screen
        name="Add"
        component={addEventStack}
        options={{
          tabBarLabel: "Add event",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={eventsStack}
        options={{
          tabBarLabel: "Events",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={profileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
