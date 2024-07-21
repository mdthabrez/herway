import React, { useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Alert, TouchableOpacity } from 'react-native';

const FloatingSosButton = () => {
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: pan.x, dy: pan.y }
    ], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value
      });
    }
  });

  const handleSosPress = () => {
    Alert.alert(
      "SOS Alert",
      "Are you sure you want to send an SOS alert?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => console.log("SOS Alert sent!") }
      ]
    );
  };

  return (
    <Animated.View
      style={[styles.button, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={handleSosPress}>
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FloatingSosButton;
