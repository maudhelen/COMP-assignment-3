import React, { createContext, useState, useEffect } from 'react';
import { getScannedLocations, addScannedLocation } from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [scannedLocations, setScannedLocations] = useState([]);

  // Fetch scanned locations for the current user and project
  const fetchScannedLocations = async (projectId) => {
    try {
      const fetchedScannedLocations = await getScannedLocations(projectId);
      const locationIds = fetchedScannedLocations.map(loc => loc.location_id);
      setScannedLocations(locationIds);
    } catch (error) {
      console.error('Error fetching scanned locations:', error);
    }
  };

  // Add a new scanned location to the database and update state
  const addNewScan = async (projectId, locationId) => {
    try {
      await addScannedLocation({ project_id: projectId, location_id: locationId, username: user });
      setScannedLocations(prev => [...prev, locationId]);
      console.log('Scanned location added:', scannedLocations);
    } catch (error) {
      console.error('Error adding scanned location:', error);
    }
  };

  return (
    <DataContext.Provider 
      value={{ 
        user, 
        setUser, 
        userAvatar, 
        setUserAvatar, 
        scannedLocations, 
        fetchScannedLocations, 
        addNewScan 
      }}
    >
      {children}
    </DataContext.Provider>
  );
};