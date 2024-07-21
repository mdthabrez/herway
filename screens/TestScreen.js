import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const dummyLocations = [
  '123 Anna Salai, Chennai',
  '456 Mount Road, Chennai',
  '789 T Nagar, Chennai',
  '101 Nungambakkam, Chennai',
  '202 Adyar, Chennai',
];

const taxiTypes = {
  auto: { icon: require('../assets/UberAuto.png'), name: 'Auto', basePrice: 30, mapIcon: require('../assets/UberAuto.png') },
  femaleDriver: { icon: require('../assets/UberAuto.png'), name: 'Female Driver', basePrice: 60, mapIcon: require('../assets/UberAuto.png') }, // New type
  car: { icon: require('../assets/UbercarX.jpeg'), name: 'Car', basePrice: 50, mapIcon: require('../assets/top-UberX.png') },
  suv: { icon: require('../assets/top-UberXL.png'), name: 'SUV', basePrice: 80, mapIcon: require('../assets/top-UberXL.png') },
 
};

const initialRegion = {
  latitude: 13.0827,
  longitude: 80.2707,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const generateRandomCoordinates = (latitude, longitude, count, offset = 0.002) => {
  return Array.from({ length: count }, () => ({
    latitude: latitude + (Math.random() - 0.5) * offset,
    longitude: longitude + (Math.random() - 0.5) * offset,
  }));
};

const generateTaxiMarkers = () => {
  const autoMarkers = generateRandomCoordinates(initialRegion.latitude, initialRegion.longitude, 3);
  const carMarkers = generateRandomCoordinates(initialRegion.latitude + 0.003, initialRegion.longitude, 3);
  const suvMarkers = generateRandomCoordinates(initialRegion.latitude + 0.006, initialRegion.longitude, 3);
  const femaleDriverMarkers = generateRandomCoordinates(initialRegion.latitude + 0.009, initialRegion.longitude, 3); // New type

  return [
    ...autoMarkers.map(coord => ({ type: 'auto', coordinate: coord })),
    ...carMarkers.map(coord => ({ type: 'car', coordinate: coord })),
    ...suvMarkers.map(coord => ({ type: 'suv', coordinate: coord })),
    ...femaleDriverMarkers.map(coord => ({ type: 'femaleDriver', coordinate: coord })), // New type
  ];
};

const TestScreen = () => {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fromMarker, setFromMarker] = useState(null);
  const [toMarker, setToMarker] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [selectedTaxiType, setSelectedTaxiType] = useState('auto');
  const [taxiMarkers, setTaxiMarkers] = useState(generateTaxiMarkers());
  const [filteredTaxiMarkers, setFilteredTaxiMarkers] = useState([]);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    generateRandomPrices();
  }, []);

  useEffect(() => {
    filterTaxiMarkers();
  }, [taxiMarkers, selectedTaxiType]);

  const generateRandomPrices = () => {
    const newPrices = {};
    Object.keys(taxiTypes).forEach(type => {
      const basePrice = taxiTypes[type].basePrice;
      const randomFactor = 1 + (Math.random() * 0.4 - 0.2); // +/- 20%
      newPrices[type] = Math.round(basePrice * randomFactor);
    });
    setPrices(newPrices);
  };

  const filterTaxiMarkers = () => {
    const filteredMarkers = taxiMarkers.filter(marker => marker.type === selectedTaxiType);
    setFilteredTaxiMarkers(filteredMarkers);
  };

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
    setActiveField(type);
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
    setActiveField(null);
  };

  const handleTaxiTypeChange = (type) => {
    setSelectedTaxiType(type);
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
        {filteredTaxiMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={`Taxi ${taxiTypes[marker.type].name}`}
          >
            <Image
              source={taxiTypes[marker.type].mapIcon}
              style={styles.taxiIcon}
            />
          </Marker>
        ))}
      </MapView>
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.locationContainer}>
          <View style={styles.locationInput}>
            <Ionicons name="person-outline" size={24} color="green" />
            <TextInput
              style={styles.input}
              value={fromQuery}
              onChangeText={(text) => handleInputChange(text, 'from')}
              placeholder="Where from?"
            />
          </View>
          <View style={styles.locationInput}>
            <Ionicons name="location-outline" size={24} color="red" />
            <TextInput
              style={styles.input}
              value={toQuery}
              onChangeText={(text) => handleInputChange(text, 'to')}
              placeholder="To?"
            />
          </View>
          <TouchableOpacity style={styles.nowButton}>
            <Text style={styles.nowButtonText}>Now</Text>
          </TouchableOpacity>
        </View>
        {activeField && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionPress(item, activeField)}>
                <View style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.suggestionList}
          />
        )}
        <FlatList
          data={Object.keys(taxiTypes)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.taxiTypeButton,
                selectedTaxiType === item && styles.selectedTaxiTypeButton
              ]}
              onPress={() => handleTaxiTypeChange(item)}
            >
              <Image
                source={taxiTypes[item].icon}
                style={styles.taxiTypeIcon}
              />
              <View style={styles.taxiTypeInfo}>
                <Text style={styles.taxiTypeName}>{taxiTypes[item].name}</Text>
                <Text style={styles.taxiTypePrice}>₹{prices[item] || '--'}</Text>
              </View>
              <Text style={styles.estimatedTime}>2 min</Text>
            </TouchableOpacity>
          )}
          style={styles.taxiTypeList}
        />
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book {taxiTypes[selectedTaxiType].name}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  nowButton: {
    position: 'absolute',
    right: 0,
    top: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 15,
  },
  nowButtonText: {
    fontSize: 14,
  },
  suggestionList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
  },
  taxiTypeList: {
    maxHeight: 250,
  },
  taxiTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedTaxiTypeButton: {
    backgroundColor: '#f0f0f0',
  },
  taxiTypeIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  taxiTypeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  taxiTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taxiTypePrice: {
    fontSize: 14,
    color: '#666',
  },
  estimatedTime: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taxiIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default TestScreen;
