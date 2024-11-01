import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { globalStyles } from '../../styles';
import { router } from 'expo-router';
import { getProject } from '../../services/api';
import { LocationContext } from '../../context/LocationContext';
import { ProjectContext } from '../../context/ProjectContext';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState, useContext } from 'react';
import RenderHTML from 'react-native-render-html';
import { Dimensions } from 'react-native';

const contentWidth = Dimensions.get('window').width;

export default function ProjectHome() {
  const { projectId } = useContext(ProjectContext);
  const { locations, scannedLocations, loading, refreshLocations } = useContext(LocationContext);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProject = await getProject(projectId);
        setProject(fetchedProject[0]);
        await refreshLocations(projectId);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  // console.log(project.homescreen_display);

  const totalPoints = locations.reduce((sum, loc) => sum + loc.score_points, 0);
  const scoredPoints = scannedLocations.reduce((sum, scannedLoc) => {
    const location = locations.find((loc) => loc.id === scannedLoc.location_id);
    return location ? sum + location.score_points : sum;
  }, 0);

  const totalLocations = locations.length;
  const visitedLocationsCount = scannedLocations.length;

  const renderAllLocations = () => (
    <View style={styles.locationScroll}>
      {locations.map((location) => (
        <View key={location.id} style={styles.locationDetail}>
          <Text style={styles.instructionTitle}>{location.location_name || 'No name provided'}</Text>
          <RenderHTML
            contentWidth={contentWidth - 40}
            source={{ html: location.location_content }}
            tagsStyles={htmlStyles}
          />
          {location.clue && (
            <Text style={styles.instructionContent}>
              <Text style={{ fontStyle: 'italic' }}>Clue:</Text> {location.clue}
            </Text>
          )}
          <View style={styles.divider} />
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/projects')}>
          <Feather name="arrow-left" size={24} color="grey" />
          <Text style={styles.backButtonText}>Back to Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reloadButton} onPress={() => refreshLocations(projectId)}>
          <Feather name="refresh-cw" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.errorText}>Project not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
    <TouchableOpacity style={styles.backButton} onPress={() => router.push('/projects')}>
      <Feather name="arrow-left" size={24} color="grey" />
      <Text style={styles.backButtonText}>Back to Projects</Text>
    </TouchableOpacity>
    {/* <TouchableOpacity style={styles.reloadButton} onPress={() => refreshLocations(projectId)}>
      <Feather name="refresh-cw" size={24} color="#fff" />
    </TouchableOpacity> */}
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{project.title || 'Project'}</Text>
    </View>

  <ScrollView contentContainerStyle={styles.scrollContainer}>

    <View style={styles.instructionBox}>
      <Text style={styles.instructionTitle}>Instructions</Text>
      <Text style={styles.instructionContent}>{project.instructions || 'No instructions provided.'}</Text>

      <Text style={styles.instructionTitle}>Initial Clue</Text>
      <Text style={styles.instructionContent}>{project.initial_clue || 'No initial clue available.'}</Text>

      <Text style={styles.instructionTitle}>Description</Text>
      <Text style={styles.instructionContent}>{project.description || 'No description available.'}</Text>

      <Text style={styles.instructionTitle}>Scoring</Text>
      <Text style={styles.instructionContent}>{project.participant_scoring || 'No scoring information available.'}</Text>

      {project.homescreen_display === 'Display all locations' && (<Text style={styles.instructionTitle}>Locations</Text>)}
      {project.homescreen_display === 'Display all locations' && renderAllLocations()}

    </View>

  </ScrollView>

  {/* Scoring and visited locations at the bottom */}
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
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  locationDetail: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 5,
    left: 10,
    padding: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  backButtonText: {
    color: 'grey',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  banner: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 45,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionBox: {
    backgroundColor: '#f8f8f8',
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    height: '70',
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
    top: 60,
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
  locationScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

// HTML tag styles
const htmlStyles = {
  img: {
    width: '100%',
    height: 'auto',
    marginVertical: 10,
  },
  p: {
    fontSize: 16,
    marginVertical: 5,
  },
  h1: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 6,
  },
};
