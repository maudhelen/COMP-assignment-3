// context/DataContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getProjects } from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ projects, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};