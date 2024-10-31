import React, { createContext, useState, useEffect } from 'react';
import { getScannedLocations, addScannedLocation } from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);

  return (
    <DataContext.Provider 
      value={{ 
        user, 
        setUser, 
        userAvatar, 
        setUserAvatar, 
      }}
    >
      {children}
    </DataContext.Provider>
  );
};