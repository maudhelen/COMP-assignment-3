import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { getLocations, getScannedLocations } from '../../services/api';
import { Feather } from '@expo/vector-icons';
import LocationPopup from '../../components/LocationPopup'; 
import { deleteScannedLocations } from '../../services/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  refreshButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 5,
  },
});

export default function ShowMap() {
  const { projectId } = useLocalSearchParams();

  const [mapState, setMapState] = useState({
    locationPermission: false,
    locations: [],
    scannedLocationIds: [],
    userLocation: null,
    loading: true,
  });
  const [initialRegion, setInitialRegion] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch all locations for the project
  const fetchProjectLocations = async () => {
    if (!projectId) return;

    try {
      const fetchedLocations = await getLocations(projectId);
      const updatedLocations = fetchedLocations.map(location => {
        const [longitude, latitude] = location.location_position
          .replace(/[()]/g, '')
          .split(',')
          .map(coord => parseFloat(coord));

        return {
          ...location,
          coordinates: { latitude, longitude },
        };
      });

      setMapState(prevState => ({
        ...prevState,
        locations: updatedLocations,
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch scanned locations for the user
  const fetchScannedLocations = async () => {
    if (!projectId) return;

    try {
      const scannedLocations = await getScannedLocations(projectId);
      const scannedLocationIds = scannedLocations.map(loc => loc.location_id);

      setMapState(prevState => ({
        ...prevState,
        scannedLocationIds,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching scanned locations:', error);
      setMapState(prevState => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchProjectLocations();
    fetchScannedLocations();
  }, [projectId]);

  useEffect(() => {
    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setMapState(prevState => ({
          ...prevState,
          locationPermission: true,
          userLocation,
        }));

        setInitialRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    }

    requestLocationPermission();
  }, []);

  const handleLocationPress = (location) => {
    setSelectedLocation(location); // Set selected location for popup
    setPopupVisible(true);         // Show the popup
  };

  if (mapState.loading || !initialRegion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading locations...</Text>
      </SafeAreaView>
    );
  }

  // Filter locations to only include scanned ones
  const scannedLocations = mapState.locations.filter(location =>
    mapState.scannedLocationIds.includes(location.id)
  );

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        initialRegion={initialRegion}
        showsUserLocation={mapState.locationPermission}
        style={StyleSheet.absoluteFillObject}
      >
        {scannedLocations.map(location => (
          <TouchableOpacity>
            <Circle
              center={location.coordinates}
              radius={100}
              fillColor="rgba(255, 105, 180, 0.5)"
              strokeColor="#ff69b4"
            />
            <Marker
              coordinate={location.coordinates}
              onPress={() => handleLocationPress(location)}
            />
          </TouchableOpacity>
        ))}
      </MapView>

      {/* Location Popup */}
      <LocationPopup
        visible={popupVisible}
        location={selectedLocation}
        onClose={() => setPopupVisible(false)}
      />

      {/* Refresh Button */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          fetchProjectLocations();
          fetchScannedLocations();
        }}
      >
        <Feather name="refresh-cw" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Delete All Locations Button */}
      <TouchableOpacity
        style={{ ...styles.refreshButton, top: 60 }}
        onPress={() => deleteScannedLocations(projectId)}
        
      >
        <Feather name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}