import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { LocationContext } from '../../context/LocationContext';
import { addTracking } from '../../services/api';
import LocationPopup from '../../components/LocationPopup';
import { DataContext } from '../../context/DataContext';

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedLocation, setScannedLocation] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const { user } = useContext(DataContext);
  const { locations, scannedLocations, refreshLocations } = useContext(LocationContext); 

  // Request camera permission
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

  const handleScan = async (projectId, locationId) => {
    const alreadyScanned = scannedLocations.some(loc => loc.location_id === locationId);

    if (alreadyScanned) {
      Alert.alert('Already Scanned', 'You have already scanned this location!');
      return;
    }

    try {
      await addTracking({ project_id: projectId, location_id: locationId, username: user });

      // Call the context refresh function to update state globally
      await refreshLocations(projectId);

      Alert.alert('Success', 'Location scanned successfully!');
    } catch (error) {
      console.error('Error adding tracking:', error);
      Alert.alert('Error', 'Could not add tracking for the scanned location.');
    }
  };

  // Handle scanned QR code logic remains the same
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const [projectId, locationId] = data.split('-').map(Number);
    const matchingLocation = locations.find(loc => loc.id === locationId);

    if (matchingLocation) {
      setScannedLocation(matchingLocation);
      setPopupVisible(true);
      handleScan(projectId, locationId);
    } else {
      Alert.alert('Invalid Scan', 'This QR code does not match any known locations.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <LocationPopup
        visible={popupVisible}
        location={scannedLocation}
        onClose={() => setPopupVisible(false)}
      />

      {scanned && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>
            Scanned: {scannedLocation?.location_name || ''}
          </Text>
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  scanResultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});