import React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

const HideKeyboard = props => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {props.children}
    </TouchableWithoutFeedback>
  );
};
export default HideKeyboard;
