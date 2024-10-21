import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../styles';
import { useLocalSearchParams } from 'expo-router';
import { getProject } from '../../services/api';  // Assume this function fetches a project by ID

export default function ProjectHome() {
  // Retrieve projectId from URL params
  const { projectId } = useLocalSearchParams();
  console.log("projectId", projectId);  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch project data when the component mounts
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const fetchedProject = await getProject(projectId);
        console.log("fetchedProject", fetchedProject);  
        setProject(fetchedProject[0]);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  // Show loading indicator while fetching project data
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
      {/* Project Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{project.title ? project.title : 'Project'}</Text>
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
            <Text style={styles.bottomBoxText}>Points 0 / 10</Text>
          </View>
          <View style={styles.bottomBox}>
            <Text style={styles.bottomBoxText}>Locations visited 0 / 3</Text>
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
    paddingVertical: 10,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    borderRadius: 10,
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
});