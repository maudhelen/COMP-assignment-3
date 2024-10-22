import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useLocalSearchParams } from 'expo-router';
import { getLocations, getScannedLocations } from '../../services/api'; // Include getScannedLocations
import { Feather } from '@expo/vector-icons';

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
          <Circle
            key={location.id}
            center={location.coordinates}
            radius={100}
            fillColor="rgba(255, 105, 180, 0.5)"
            strokeColor="#ff69b4"
          />
        ))}
      </MapView>

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
    </SafeAreaView>
  );
}