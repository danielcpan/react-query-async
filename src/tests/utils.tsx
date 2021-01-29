import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

interface MockProps {
  isSuccess: boolean;
  timeout?: number;
  data?: any;
}

export const mock = ({ isSuccess, timeout = 0, data }: MockProps) => {
  return new Promise((resolve: any, reject: any) => {
    setTimeout(() => (isSuccess ? resolve(data) : reject({ message: 'Error' })), timeout);
  });
};

export const renderWithRQClient = (client: QueryClient, ui: React.ReactElement) => {
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

export const sleep = (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
