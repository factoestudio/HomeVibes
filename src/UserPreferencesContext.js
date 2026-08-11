import React, { createContext, useContext, useState } from 'react';

const UserPreferencesContext = createContext(null);

export const UserPreferencesProvider = ({ children, initialPreferences = null }) => {
  const [userPreferences, setUserPreferences] = useState(initialPreferences);

  const updatePreferences = (newPrefs) => {
    setUserPreferences(newPrefs);
  };

  return (
    <UserPreferencesContext.Provider value={{ userPreferences, setUserPreferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    return { userPreferences: null, setUserPreferences: () => {}, updatePreferences: () => {} };
  }
  return context;
};

export default UserPreferencesContext;
