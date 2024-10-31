import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles } from '../styles';
import { getProjects } from '../services/api';
import { ProjectContext } from '../context/ProjectContext';  // Import ProjectContext


export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setProjectId } = useContext(ProjectContext);  // Access setProjectId from context


  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();  // Fetch projects from the API
        const publishedProjects = data.filter(project => project.is_published);  // Filter only published projects
        setProjects(publishedProjects);  // Set projects state
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Show loading indicator while fetching projects
  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </SafeAreaView>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // Render the list of projects
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.projectList}>
        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectButton}
            onPress={() => {
              setProjectId(project.id);  // Update projectId in context
              const serializedProject = encodeURIComponent(JSON.stringify(project));
              router.push(`/projects/${project.id}/home?projectData=${serializedProject}`);
            }}
          >
            <Text style={styles.projectName}>{project.title}</Text>
            <View style={styles.participantsPill}>
              <Text style={styles.participantsText}>
                id: {project.id || 0}
              </Text>
            </View>
            {/* <View style={styles.participantsPill}>
              <Text style={styles.participantsText}>
                Participants: {project.participants || 0}
              </Text>
            </View> */}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  projectList: {
    paddingHorizontal: 20,
  },
  projectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ff69b4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  participantsPill: {
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  participantsText: {
    color: '#ff69b4',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});