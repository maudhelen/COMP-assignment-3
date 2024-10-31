import React, { createContext, useState, useContext } from 'react';
import { getLocations, getScannedLocations, addTracking } from '../services/api';
import { useLocalSearchParams } from 'expo-router';
import { DataContext } from './DataContext'
import { ProjectContext } from './ProjectContext';


// Create LocationContext
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);          // All project locations
  const [scannedLocations, setScannedLocations] = useState([]);  // User's scanned locations
  const [loading, setLoading] = useState(false);

  const { user } = useContext(DataContext);
  const { projectId } = useContext(ProjectContext); // Access projectId from ProjectContext

  console.log("From LocationContext.jsx: ", projectId);

  
  // Fetch all locations for a specific project
  const fetchLocations = async (projectId) => {
    setLoading(true);
    try {
      const fetchedLocations = await getLocations(projectId);
      setLocations(fetchedLocations);
      // console.log("Fetched Locations:", fetchedLocations);  // Check locations data
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch scanned locations for the user in a specific project
  const fetchScannedLocations = async (projectId) => {
    setLoading(true);
    try {
      const fetchedScannedLocations = await getScannedLocations(projectId, user);
      setScannedLocations(fetchedScannedLocations);
      // console.log("Fetched Scanned Locations:", fetchedScannedLocations); // Check scanned locations
    } catch (error) {
      console.error('Error fetching scanned locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh all locations and scanned locations for the current project
  const refreshLocations = async (projectId) => {
    if (projectId) {
      setLoading(true);
      try {
        await fetchLocations(projectId);
        await fetchScannedLocations(projectId);
      } catch (error) {
        console.error('Error refreshing locations:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Clear scanned locations (for reset or deletion)
  const clearScannedLocations = () => {
    setScannedLocations([]);
  };

  // Function to post a new scanned location and refresh context
const postNewScan = async (locationId, projectId) => {
    try {
      // Check if the location has already been scanned
      if (!scannedLocations.some(loc => loc.location_id === locationId)) {
        // Post the new scan to the tracking endpoint
        await addTracking({ project_id: projectId, location_id: locationId, participant_username: user });
  
        // Update state and refresh context
        setScannedLocations(prev => [...prev, { location_id: locationId }]);

        console.log('New scan added:', { location_id: locationId });
        console.log('Scanned locations:', scannedLocations);
        await fetchLocations(projectId);
      }
    } catch (error) {
      console.error('Error posting new scan:', error);
    }
  };
  
  return (
    <LocationContext.Provider
      value={{
        locations,
        scannedLocations,
        loading,
        refreshLocations,
        clearScannedLocations,
        postNewScan,  // Expose new function
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}