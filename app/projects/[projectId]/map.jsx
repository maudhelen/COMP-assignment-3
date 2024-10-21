import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, Appearance, View, TouchableOpacity } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useLocalSearchParams } from 'expo-router';  // For getting projectId from URL params
import { getLocations } from '../../services/api';  // Fetch locations from API
import { Feather } from '@expo/vector-icons'; // Icon library

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyLocationSafeAreaView: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 10, 
    borderWidth: 3, 
    borderColor: '#ff69b4', 
  },
  nearbyLocationView: {
    padding: 20,
  },
  nearbyLocationText: {
    fontSize: 20,
    lineHeight: 25,
    color: '#ff69b4',
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  refreshButton: {
    position: 'absolute',
    top: 50,
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

const NearbyLocation = ({ location, distance }) => {
  if (location && distance) {
    return (
      <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
        <View style={styles.nearbyLocationView}>
          <Text style={styles.nearbyLocationText}>
            Nearest Location: {location.location_name}
          </Text>
          {distance.nearby ? (
            <Text style={styles.nearbyLocationText}>
              You are within 100 meters of this location
            </Text>
          ) : (
            <Text style={styles.nearbyLocationText}>
              You are {distance.metres.toFixed(2)} meters away from this location
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }
  return null;
};

export default function ShowMap() {
  const { projectId } = useLocalSearchParams(); 

  const [mapState, setMapState] = useState({
    locationPermission: false,
    locations: [],
    userLocation: null,
    nearbyLocation: null,
    loading: true,
  });
  const [initialRegion, setInitialRegion] = useState(null); 

  // Fetch locations from the API
  const fetchProjectLocations = async () => {
    if (!projectId) {
      console.error('No projectId provided in URL params');
      return;
    }

    try {
      const fetchedLocations = await getLocations(projectId);
      const updatedLocations = fetchedLocations.map((location) => {
        const latlong = location.location_position.split(",");
        location.coordinates = {
          longitude: parseFloat(latlong[0].replace("(", "")),
          latitude: parseFloat(latlong[1].replace(")", "")),
        };
        return location;
      });

      setMapState((prevState) => ({
        ...prevState,
        locations: updatedLocations,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      setMapState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchProjectLocations();
  }, [projectId]); 

  useEffect(() => {
    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setMapState((prevState) => ({
          ...prevState,
          locationPermission: true,
        }));

        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setMapState((prevState) => ({
          ...prevState,
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

  useEffect(() => {
    function calculateDistance(userLocation) {
      if (!userLocation) return null;

      const nearestLocation = mapState.locations
        .map((location) => {
          const metres = getDistance(userLocation, location.coordinates);
          location.distance = {
            metres,
            nearby: metres <= 100,
          };
          return location;
        })
        .sort((a, b) => a.distance.metres - b.distance.metres);

      return nearestLocation.length > 0 ? nearestLocation[0] : null;
    }

    let locationSubscription = null;

    if (mapState.locationPermission) {
      (async () => {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 1,
          },
          (location) => {
            const userLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            const nearestLocation = calculateDistance(userLocation);

            setMapState((prevState) => ({
              ...prevState,
              userLocation,
              nearbyLocation: nearestLocation,
            }));
          }
        );
      })();
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [mapState.locationPermission, mapState.locations]);

  if (mapState.loading || !initialRegion) {
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
        showsUserLocation={mapState.locationPermission}
        style={styles.container}
      >
        {mapState.locations.map((location) => (
          <Circle
            key={location.id}
            center={location.coordinates}
            radius={100}
            fillColor="rgba(255, 105, 180, 0.5)" 
            strokeColor="#ff69b4" 
          />
        ))}
      </MapView>

      {mapState.nearbyLocation && (
        <NearbyLocation 
          location={mapState.nearbyLocation} 
          distance={mapState.nearbyLocation.distance} 
        />
      )}

      {/* Refresh Button */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={fetchProjectLocations}
      >
        <Feather name="refresh-cw" size={24} color="#fff" />
      </TouchableOpacity>
    </>
  );
}