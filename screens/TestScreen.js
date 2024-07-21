import React, { useState } from 'react';
import { SafeAreaView, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

// Dummy locations for search suggestions
const dummyLocations = [
  '123 Main St, Springfield',
  '456 Elm St, Metropolis',
  '789 Oak St, Gotham',
  '101 Maple St, Star City',
  '202 Pine St, Central City',
];

// Dummy taxis data
const dummyTaxis = [
  { id: '1', latitude: 37.78825, longitude: -122.4324 },
  { id: '2', latitude: 37.78850, longitude: -122.4340 },
  { id: '3', latitude: 37.78700, longitude: -122.4300 },
  { id: '4', latitude: 37.78900, longitude: -122.4330 },
  { id: '5', latitude: 37.78600, longitude: -122.4310 },
];

const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const TestScreen = () => {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fromMarker, setFromMarker] = useState(null);
  const [toMarker, setToMarker] = useState(null);
  const [activeField, setActiveField] = useState(null); // State to track the active input field

  const handleInputChange = (text, type) => {
    if (type === 'from') {
      setFromQuery(text);
    } else {
      setToQuery(text);
    }

    if (text.length > 0) {
      const filteredLocations = dummyLocations.filter(location =>
        location.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredLocations);
    } else {
      setSuggestions([]);
    }
    setActiveField(type); // Set the active input field
  };

  const handleSuggestionPress = (suggestion, type) => {
    const randomLat = initialRegion.latitude + (Math.random() - 0.5) * 0.01;
    const randomLng = initialRegion.longitude + (Math.random() - 0.5) * 0.01;
    if (type === 'from') {
      setFromQuery(suggestion);
      setFromMarker({
        latitude: randomLat,
        longitude: randomLng,
      });
    } else {
      setToQuery(suggestion);
      setToMarker({
        latitude: randomLat,
        longitude: randomLng,
      });
    }
    setSuggestions([]);
    setActiveField(null); // Reset the active input field
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {fromMarker && (
          <Marker coordinate={fromMarker} title="From" pinColor="green" />
        )}
        {toMarker && (
          <Marker coordinate={toMarker} title="To" pinColor="red" />
        )}
        {fromMarker && toMarker && (
          <Polyline
            coordinates={[fromMarker, toMarker]}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}
        {dummyTaxis.map(taxi => (
          <Marker
            key={taxi.id}
            coordinate={{ latitude: taxi.latitude, longitude: taxi.longitude }}
            title={`Taxi ${taxi.id}`}
          >
            <Image
              source={require('../assets/top-UberX.png')} // Ensure you have a taxi icon image in the assets folder
              style={styles.taxiIcon}
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={fromQuery}
          onChangeText={(text) => handleInputChange(text, 'from')}
          onFocus={() => setActiveField('from')}
          placeholder="Where from?"
        />
        {activeField === 'from' && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionPress(item, 'from')}>
                <View style={styles.suggestionItem}>
                  <Text>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <TextInput
          style={styles.input}
          value={toQuery}
          onChangeText={(text) => handleInputChange(text, 'to')}
          onFocus={() => setActiveField('to')}
          placeholder="To?"
        />
        {activeField === 'to' && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionPress(item, 'to')}>
                <View style={styles.suggestionItem}>
                  <Text>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    elevation: 10,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20, // Rounded corners for input fields
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
  },
  suggestionItem: {
    padding: 10,
    borderRadius: 20, // Rounded corners for suggestion items
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
  },
  taxiIcon: {
    width: 30, // Adjust the size of the icon here
    height: 30, // Adjust the size of the icon here
  },
});

export default TestScreen;
