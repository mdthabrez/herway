// components/SOSButton.js
import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text, Animated, PanResponder, View } from 'react-native';

const SOSButton = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  // Create PanResponder to handle drag gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gestureState) => {
      // Update position based on gesture
      Animated.spring(pan, {
        toValue: { x: pan.x._value + gestureState.dx, y: pan.y._value + gestureState.dy },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <Animated.View
      style={[styles.container, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SOSButton;
