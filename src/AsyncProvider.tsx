import React, { createContext, useContext } from 'react';

export const AsyncContext = createContext({} as any);

export const useAsyncContext = () => useContext(AsyncContext);

const AsyncProvider: React.FC = ({ children, config = {} }: any) => {
  return <AsyncContext.Provider value={config}>{children}</AsyncContext.Provider>;
};

export default AsyncProvider;
