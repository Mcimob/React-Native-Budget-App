import React from 'react';
import {View, Text, Pressable, Animated} from 'react-native';
import styles from '../styles';
import {Icon} from '../Icon';

export default function ToggleBar({
  handleToggle,
  togglePosition,
  toggleState,
  setToggleState,
}) {
  return (
    <View style={[styles.row, styles.pad10, {justifyContent: 'space-between'}]}>
      <Text style={[styles.textBasic, styles.subTitle]}>All Entries:</Text>
      <Pressable
        style={[styles.row, styles.toggleSelector]}
        onPress={() => {
          handleToggle(toggleState, setToggleState, togglePosition);
        }}>
        <Animated.View
          style={[
            styles.animatedToggleSelector,
            {
              left: togglePosition.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 40],
              }),
              width: togglePosition.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [50, 0, 50],
              }),
              height: togglePosition.interpolate({
                inputRange: [-0, 0.5, 1],
                outputRange: [50, 0, 50],
              }),
              borderRadius: togglePosition.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [25, 0, 25],
              }),
            },
          ]}
        />
        <Icon type="feather" name="list" color="white" />
        <Icon type="feather" name="grid" color="white" />
      </Pressable>
    </View>
  );
}
