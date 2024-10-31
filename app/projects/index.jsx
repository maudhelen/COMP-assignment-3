import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles } from '../styles';
import { getProjects, getUniqueParticipantCount } from '../services/api';
import { ProjectContext } from '../context/ProjectContext';
import { useFocusEffect } from '@react-navigation/native';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setProjectId } = useContext(ProjectContext);

  const fetchProjectsWithParticipants = async () => {
    try {
      const data = await getProjects();
      const publishedProjects = data.filter(project => project.is_published);

      // Add participant count to each project
      const projectsWithParticipants = await Promise.all(
        publishedProjects.map(async (project) => {
          const participantCount = await getUniqueParticipantCount(project.id);
          return { ...project, participantCount };
        })
      );

      setProjects(projectsWithParticipants);
    } catch (error) {
      console.error('Error fetching projects with participants:', error);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading each time the tab is focused
      fetchProjectsWithParticipants();
    }, [])
  );

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
              setProjectId(project.id);
              const serializedProject = encodeURIComponent(JSON.stringify(project));
              router.push(`/projects/${project.id}/home?projectData=${serializedProject}`);
            }}
          >
            <Text style={styles.projectName}>{project.title}</Text>
            <View style={styles.participantsPill}>
              <Text style={styles.participantsText}>
                Participants: {project.participantCount || 0}
              </Text>
            </View>
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
