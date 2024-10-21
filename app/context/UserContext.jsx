// UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userAvatar, setUserAvatar] = useState(null);

  return (
    <UserContext.Provider value={{ userAvatar, setUserAvatar }}>
      {children}
    </UserContext.Provider>
  );
};