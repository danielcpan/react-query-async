import React, { createContext, useContext } from 'react';
import { AsyncProviderProps } from './types';

export const AsyncContext = createContext<any>({});

export const useAsyncContext = () => useContext(AsyncContext);

const AsyncProvider: React.FC<AsyncProviderProps> = ({ children, config = {} }) => {
  return <AsyncContext.Provider value={config}>{children}</AsyncContext.Provider>;
};

export default AsyncProvider;
