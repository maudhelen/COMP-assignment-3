import React, { createContext, useState } from 'react';

// Create the context
export const DataContext = createContext();

// Create the provider component
export const DataProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [userAvatar, setUserAvatar] = useState('');  // New state for photo

  return (
    <DataContext.Provider value={{ user, setUser, userAvatar, setUserAvatar }}>
      {children}
    </DataContext.Provider>
  );
};