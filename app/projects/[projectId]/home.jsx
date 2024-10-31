import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../../styles';
import { useLocalSearchParams } from 'expo-router';
import { getProject } from '../../services/api';
import { LocationContext } from '../../context/LocationContext';
import { Feather } from '@expo/vector-icons';

export default function ProjectHome() {
  const { projectId } = useLocalSearchParams();
  const { 
    locations, 
    scannedLocations, 
    loading, 
    refreshLocations, 
    postNewScan 
  } = useContext(LocationContext);
  const [project, setProject] = useState(null);

  // Fetch project data and refresh context when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProject = await getProject(projectId);
        setProject(fetchedProject[0]);
        await refreshLocations(projectId);  // Ensure context refresh on load
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  // Calculate total possible points
  const totalPoints = locations.reduce((sum, loc) => sum + loc.score_points, 0);

  // Calculate scored points from scanned locations
  const scoredPoints = scannedLocations.reduce((sum, scannedLoc) => {
    const location = locations.find(loc => loc.id === scannedLoc.location_id);
    return location ? sum + location.score_points : sum;
  }, 0);

  // Calculate total and visited locations
  const totalLocations = locations.length;
  const visitedLocationsCount = scannedLocations.length;
  
  // Show loading indicator while fetching data
  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </SafeAreaView>
    );
  }

  // If no project data is found, show an error message
  if (!project) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Text style={styles.errorText}>Project not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Reload Button */}
      <TouchableOpacity 
        style={styles.reloadButton}
        onPress={() => refreshLocations(projectId)}  // Refresh locations on button press
      >
        <Feather name="refresh-cw" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Project Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{project.title || 'Project'}</Text>
      </View>

      {/* Instruction Box */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>Instructions</Text>
        <Text style={styles.instructionContent}>
          {project.instructions || 'No instructions provided.'}
        </Text>

        {/* Initial Clue */}
        <Text style={styles.instructionTitle}>Initial Clue</Text>
        <Text style={styles.instructionContent}>
          {project.initial_clue || 'No initial clue available.'}
        </Text>

        {/* Description */}
        <Text style={styles.instructionTitle}>Description</Text>
        <Text style={styles.instructionContent}>
          {project.description || 'No description available.'}
        </Text>

        {/* Scoring */}
        <Text style={styles.instructionTitle}>Scoring</Text>
        <Text style={styles.instructionContent}>
          {project.participant_scoring || 'No scoring information available.'}
        </Text>

        {/* Bottom Boxes */}
        <View style={styles.bottomContainer}>
          <View style={styles.bottomBox}>
            <Text style={styles.bottomBoxText}>Points</Text>
            <Text style={styles.bottomBoxText}>{scoredPoints} / {totalPoints}</Text>
          </View>
          <View style={styles.bottomBox}>
            <Text style={styles.bottomBoxText}>Locations visited</Text>
            <Text style={styles.bottomBoxText}>{visitedLocationsCount} / {totalLocations}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionBox: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  bottomBox: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  bottomBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  reloadButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#ff69b4',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reloadButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});