import * as React from 'react';

const { createContext, useContext } = React;

const AppContext = createContext({});

interface Value {}

export const AppContextProvider: React.FunctionComponent = ({ children }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('cannot call useAppContext outside of AppContext');
  return ctx;
};
