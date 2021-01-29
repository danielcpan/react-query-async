import React from 'react';
import { render } from '@testing-library/react';
import { AsyncProvider, useAsyncContext } from '../core';

describe('AsyncProvider', () => {
  describe('useAsyncContext', () => {
    it('Config passed to provider should exist in context', () => {
      const defaultConfig = {
        showIdle: false,
        showFetching: false,
        components: {
          Loading: () => 'Custom Loading',
          Fetching: 'Custom Fetching',
          Error: () => 'Custom Error',
          NoData: 'No Data!'
        }
      };

      let config;

      const Page = () => {
        config = useAsyncContext();

        return null;
      };

      render(
        <AsyncProvider config={defaultConfig}>
          <Page />
        </AsyncProvider>
      );

      expect(defaultConfig).toEqual(config);
    });
  });
});
