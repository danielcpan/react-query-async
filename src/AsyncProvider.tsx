import React, { useState, createContext, useContext } from 'react';

export const AsyncContext = createContext({} as any);

// type TAsyncProvider = {
//   children: React.ReactNode;
// };

export const useAsyncContext = () => useContext(AsyncContext);

const AsyncProvider: React.FC = ({ children, defaultConfig, ...restProps }: any) => {
  // const

  return <AsyncContext.Provider value={{ defaultConfig }}>{children}</AsyncContext.Provider>;
};

export default AsyncProvider;
