import React, { createContext, useState, useEffect } from 'react';
import { getProjects } from '../services/api';

// Create the context
export const ProjectContext = createContext();

// Create the provider component
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  // Fetch projects from API
  const fetchProjects = async () => {
    setLoadingProjects(true);
    setProjectsError(null);
    try {
      const data = await getProjects();
      const publishedProjects = data.filter((project) => project.is_published);
      setProjects(publishedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError('Failed to fetch projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  // Initial fetch of projects when context is mounted
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      projectId,            
      setProjectId,        
      loadingProjects,
      projectsError,
      fetchProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
