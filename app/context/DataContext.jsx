import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState('Guest');
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