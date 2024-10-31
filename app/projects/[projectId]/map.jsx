import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, SafeAreaView, Appearance, View, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { LocationContext } from '../../context/LocationContext';
import LocationPopup from '../../components/LocationPopup';  
import { Feather } from '@expo/vector-icons';
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
  deleteButton: {
    position: 'absolute',
    top: 60,
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

const colorScheme = Appearance.getColorScheme();
const circleColor = colorScheme === 'dark' 
  ? 'rgba(255, 105, 180, 0.5)'  
  : 'rgba(255, 105, 180, 0.5)';

export default function ShowMap() {
  const { projectId } = useLocalSearchParams();
  const { locations, scannedLocations, loading, refreshLocations } = useContext(LocationContext); 
  const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Refresh locations when projectId changes
  useEffect(() => {
    if (projectId) {
      refreshLocations(projectId);
    }
  }, [projectId]);

  // Request location permission and set initial region
  useEffect(() => {
    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userLocation);
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
    setSelectedLocation(location);  
    setPopupVisible(true);  
  };

  // Parse and filter scanned locations
  const scannedLocationDetails = locations
    .filter(loc => scannedLocations.some(scanned => scanned.location_id === loc.id))
    .map(location => {
      const [longitude, latitude] = location.location_position
        .replace(/[()]/g, '')
        .split(',')
        .map(coord => parseFloat(coord));
      return {
        ...location,
        coordinates: { latitude, longitude }
      };
    });

  if (loading || !initialRegion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading locations...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <MapView
        initialRegion={initialRegion}
        showsUserLocation={!!userLocation}
        style={styles.container}
      >
        {scannedLocationDetails.map(location => (
          <React.Fragment key={location.id}>
            <Circle
              center={location.coordinates}
              radius={100}
              fillColor={circleColor}
              strokeColor="#ff69b4"
            />
            <Marker
              coordinate={location.coordinates}
              onPress={() => handleLocationPress(location)}
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* Refresh Button */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => refreshLocations(projectId)}
      >
        <Feather name="refresh-cw" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Delete All Locations Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          deleteScannedLocations(projectId);
          refreshLocations(projectId);  // Refresh context after deletion
        }}
      >
        <Feather name="trash" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Location Popup */}
      <LocationPopup
        visible={popupVisible}
        location={selectedLocation}
        onClose={() => setPopupVisible(false)}
      />
    </>
  );
}
