import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import Menu, { MenuItem, Position } from "react-native-enhanced-popup-menu";
import DialogInput from "react-native-dialog-input";
import { TouchableOpacity } from "react-native-gesture-handler";

const PopUpMenu = (props) => {
  let textRef = React.createRef();
  let menuRef = null;

  const [isDialogVisible, setIsDialogVisible] = React.useState();
  const [time, setTime] = React.useState();
  const setMenuRef = (ref) => (menuRef = ref);
  const setValue = (m) => {
    menuRef.hide();
    setTime(m);
  };
  const otherValue = () => {
    setIsDialogVisible(true);
  };
  const showMenu = () =>
    menuRef.show(textRef.current, (stickTo = Position.TOP_CENTER));

  const onPress = () => showMenu();

  useEffect(() => {
    if (props.timeTo) setTime(props.timeTo);
  });

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
      {isDialogVisible && (
        <DialogInput
          title={"How much time? (in minutes)"}
          textInputProps={{ keyboardType: "decimal-pad" }}
          submitInput={(inputText) => {
            props.onPress(inputText);
            setValue(inputText);
            setIsDialogVisible(false);
          }}
          closeDialog={() => {
            setIsDialogVisible(false);
          }}
        />
      )}
      <TouchableOpacity onPress={onPress}>
        {time ? (
          <Text ref={textRef} style={{ fontSize: 20, textAlign: "center" }}>
            {time} minutes
          </Text>
        ) : (
          <Text ref={textRef} style={{ fontSize: 20, textAlign: "center" }}>
            How long?
          </Text>
        )}
      </TouchableOpacity>
      <Menu ref={setMenuRef}>
        <MenuItem
          style={styles.menuItem}
          onPress={() => {
            props.onPress(30);
            setValue(30);
          }}
        >
          30m
        </MenuItem>
        <MenuItem
          style={styles.menuItem}
          onPress={() => {
            props.onPress(45);
            setValue(45);
          }}
        >
          45m
        </MenuItem>
        <MenuItem
          style={styles.menuItem}
          onPress={() => {
            props.onPress(60);
            setValue(60);
          }}
        >
          1h
        </MenuItem>
        <MenuItem
          style={styles.menuItem}
          onPress={() => {
            props.onPress(90);
            setValue(90);
          }}
        >
          1,5h
        </MenuItem>
        <MenuItem
          style={styles.menuItem}
          onPress={() => {
            props.onPress(120);
            setValue(120);
          }}
        >
          2h
        </MenuItem>
        <MenuItem
          style={styles.menuItem}
          onPress={() => {
            props.onPress(150);
            setValue(150);
          }}
        >
          2,5h
        </MenuItem>
        <MenuItem
          style={styles.menuItem}
          onPress={() => {
            props.onPress(180);
            setValue(180);
          }}
        >
          3h
        </MenuItem>
        <MenuItem style={styles.menuItem} onPress={() => otherValue()}>
          Other
        </MenuItem>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    height: 30,
  },
});

export default PopUpMenu;
