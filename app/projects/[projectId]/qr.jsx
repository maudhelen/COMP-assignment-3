import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { LocationContext } from '../../context/LocationContext';
import LocationPopup from '../../components/LocationPopup';

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

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedLocation, setScannedLocation] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const { locations, refreshLocations, postNewScan } = useContext(LocationContext);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

  const handleScan = async (projectId, locationId) => {
    try {
      const scanSuccess = await postNewScan(locationId, projectId);

      if (scanSuccess) {
        Alert.alert('Success', 'New location unlocked!');
        refreshLocations(projectId);
      } else {
        Alert.alert('Already Scanned', 'You have already unlocked this location!');
      }
    } catch (error) {
      console.error('Error adding tracking:', error);
      Alert.alert('Error', 'Could not add tracking for the scanned location.');
    }
  };

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
