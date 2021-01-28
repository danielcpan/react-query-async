import React, { createContext, useContext } from 'react';
import { IAsyncProvider } from './types';

export const AsyncContext = createContext<any>({});

export const useAsyncContext = () => useContext(AsyncContext);

const AsyncProvider: React.FC<IAsyncProvider> = ({ children, config = {} }) => {
  return <AsyncContext.Provider value={config}>{children}</AsyncContext.Provider>;
};

export default AsyncProvider;
