import React, { createContext, useState, useEffect } from 'react';
import { getLocations, getScannedLocations } from '../services/api';

// Create LocationContext
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);          // All project locations
  const [scannedLocations, setScannedLocations] = useState([]);  // User's scanned locations
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(null);        // Track current project ID

  // Fetch all locations for a specific project
  const fetchLocations = async (projectId) => {
    setLoading(true);
    try {
      const fetchedLocations = await getLocations(projectId);
      setLocations(fetchedLocations);
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
      const fetchedScannedLocations = await getScannedLocations(projectId);
      setScannedLocations(fetchedScannedLocations);
    } catch (error) {
      console.error('Error fetching scanned locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh all locations and scanned locations for the current project
  const refreshLocations = async (newProjectId = projectId) => {
    if (newProjectId) {
      setLoading(true);
      try {
        await fetchLocations(newProjectId);
        await fetchScannedLocations(newProjectId);
        setProjectId(newProjectId);  // Update project ID
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
        await addTracking({ project_id: projectId, location_id: locationId, username: user });
  
        // Update state and refresh context
        setScannedLocations(prev => [...prev, { location_id: locationId }]);
        await refreshLocations(projectId);
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
        setProjectId,
        postNewScan,  // Expose new function
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}