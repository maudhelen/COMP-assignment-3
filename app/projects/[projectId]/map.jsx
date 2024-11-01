import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert, Appearance } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { LocationContext } from '../../context/LocationContext';
import LocationPopup from '../../components/LocationPopup';
import { Feather } from '@expo/vector-icons';
import { ProjectContext } from '../../context/ProjectContext';
import { DataContext } from '../../context/DataContext';
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
  const { projectId } = useContext(ProjectContext);
  const { user } = useContext(DataContext);
  const { locations, scannedLocations, loading, refreshLocations, postNewScan } = useContext(LocationContext);
  const [initialRegion, setInitialRegion] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const isCheckingProximity = useRef(false);  // Ref to prevent duplicate checks
  const userLocationRef = useRef(null);  // Ref to store user location

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
        userLocationRef.current = userLocation;  // Store in ref
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

  // Check proximity without rerendering
  const checkProximity = async () => {
    console.log('Checking proximity...');
    if (isCheckingProximity.current || !userLocationRef.current) return;
    isCheckingProximity.current = true;
    const winRadius = 100;

    for (let location of locations) {
      const [longitude, latitude] = location.location_position
        .replace(/[()]/g, '')
        .split(',')
        .map(coord => parseFloat(coord));

      const locationCoords = { latitude, longitude };
      const distance = getDistance(userLocationRef.current, locationCoords);

      if (distance <= winRadius) {
        const newScan = await postNewScan(location.id, projectId);

        if (newScan) {
          Alert.alert('New Location Unlocked!', `You are within ${winRadius} meters of ${location.location_name}`);
        } else {
          console.log('Location already scanned for this user and project.');
        }
        break;
      }
    }
    isCheckingProximity.current = false;
  };

  // Track user location only when map tab is focused
  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync({});
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        userLocationRef.current = userCoords;
        checkProximity();
      }, 5000);

      return () => clearInterval(interval);
    }, [])
  );

  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    setPopupVisible(true);
  };

  const scannedLocationDetails = locations
    .filter((loc) => scannedLocations.some((scanned) => scanned.location_id === loc.id))
    .map((location) => {
      const [longitude, latitude] = location.location_position
        .replace(/[()]/g, '')
        .split(',')
        .map((coord) => parseFloat(coord));
      return {
        ...location,
        coordinates: { latitude, longitude },
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
        showsUserLocation={!!userLocationRef.current}
        style={styles.container}
      >
        {scannedLocationDetails.map((location) => (
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

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => refreshLocations(projectId)}
      >
        <Feather name="refresh-cw" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          deleteScannedLocations(projectId, user);
          refreshLocations(projectId);
        }}
      >
        <Feather name="trash" size={24} color="#fff" />
      </TouchableOpacity>

      <LocationPopup
        visible={popupVisible}
        location={selectedLocation}
        onClose={() => setPopupVisible(false)}
      />
    </>
  );
}
