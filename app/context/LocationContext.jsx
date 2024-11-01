import React, { createContext, useState, useContext, useEffect } from 'react';
import { getLocations, getScannedLocations, addTracking } from '../services/api';
import { DataContext } from './DataContext';
import { ProjectContext } from './ProjectContext';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [scannedLocations, setScannedLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(DataContext);
  const { projectId } = useContext(ProjectContext);

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

  useEffect(() => {
    if (user && projectId) {
      fetchScannedLocations();
    }
  }, [user]);  // Runs every time `user` changes

  // Fetch scanned locations for the user in a specific project
  const fetchScannedLocations = async (projectId) => {
    setLoading(true);
    try {
      const fetchedScannedLocations = await getScannedLocations(projectId, user);
      setScannedLocations(fetchedScannedLocations);
    } catch (error) {
      console.error('Error fetching scanned locations:', error);
    } finally {
      setLoading(false);
    }
  };

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

  /**
   * This function posts a new scan for the user in a specific project, if the location hasn't been scanned already for that user and project.
   * @param {int} locationId 
   * @param {int} projectId 
   * @returns boolean based on wheter it could post the new scan or not
   */
  const postNewScan = async (locationId, projectId) => {
    try {
      // Fetch the latest scanned locations and use the response directly
      const latestScannedLocations = await getScannedLocations(projectId, user);
      
      console.log();
      console.log("From postNewScan");
      console.log("Fetched scannedLocations", latestScannedLocations);
      console.log("locationId", locationId);
      console.log("user", user);
      console.log("projectId", projectId);
  
      // Check if the location has already been scanned
      const alreadyScanned = latestScannedLocations.some(
        (loc) =>
          loc.location_id === locationId &&
          loc.participant_username === user &&
          loc.project_id === projectId
      );
      console.log("Already scanned?", alreadyScanned);
  
      if (alreadyScanned) {
        return false; // Location already scanned
      }
  
      // Proceed with posting a new scan if it hasn't been scanned already
      await addTracking({
        project_id: projectId,
        location_id: locationId,
        participant_username: user,
      });
  
      // Update the state with the new scan
      setScannedLocations((prev) => [
        ...prev,
        { location_id: locationId, participant_username: user, project_id: projectId },
      ]);
  
      await fetchLocations(projectId); // Optionally refresh locations
  
      return true; // New scan successfully posted
    } catch (error) {
      console.error('Error posting new scan:', error);
      return false; // Error posting scan
    }
  };
  
  

  return (
    <LocationContext.Provider
      value={{
        locations,
        scannedLocations,
        loading,
        refreshLocations,
        fetchScannedLocations,
        postNewScan,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
