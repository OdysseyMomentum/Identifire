import * as React from 'react';

const { createContext, useContext, useState } = React;

import { createAPI } from './lib/api';

interface Value {
  api: ReturnType<typeof createAPI>;
}

const AppContext = createContext<Value>(null as any);

export const AppContextProvider: React.FunctionComponent = ({ children }) => {
  return (
    <AppContext.Provider
      value={{
        api: createAPI({ baseUrl: process.env.SERVER_URL }),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('cannot call useAppContext outside of AppContext');
  return ctx;
};
