/* eslint-disable react/display-name */
import React from 'react';
import { useQuery, QueryCache, QueryClient } from 'react-query';
import { render } from '@testing-library/react';
import { AsyncProvider, useAsyncContext, Async } from '../core';
import { mock, sleep, renderWithRQClient } from './utils';

describe('AsyncProvider', () => {
  const defaultConfig = {
    showIdle: false,
    showFetching: false,
    components: {
      Loading: <div data-testid="custom-loading">Custom Loading</div>,
      Fetching: <div data-testid="custom-fetching">Custom Fetching</div>,
      Error: <div data-testid="custom-error">Custom Error</div>,
      NoData: <div data-testid="custom-no-data">Custom No Data</div>
    }
  };

  const queryCache = new QueryCache();
  const queryClient = new QueryClient({ queryCache });

  beforeEach(() => {
    queryClient.clear();
  });

  describe('useAsyncContext', () => {
    it('Config passed to provider should exist in context', () => {
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

    describe('Provider config should be used if props are not set for an individual Async', () => {
      it('Should use custom Loading Component', async () => {
        const Page = () => {
          const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 'Foo Bar' }));

          return (
            <Async queries={{ query1 }}>
              {({
                queries: {
                  query1: { data }
                }
              }) => <div data-testid="data">{data}</div>}
            </Async>
          );
        };

        const { queryByTestId, queryByText } = renderWithRQClient(
          queryClient,
          <AsyncProvider config={defaultConfig}>
            <Page />
          </AsyncProvider>
        );

        expect(queryByTestId('data')).toBeNull();
        expect(queryByTestId('custom-loading')).not.toBeNull();

        await sleep(10);

        expect(queryByTestId('data')).not.toBeNull();
        expect(queryByText('Foo Bar')).not.toBeNull();
      });

      it('Should use custom Fetching Component', async () => {
        const Page = () => {
          const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 'Foo Bar' }), {
            retry: 0
          });

          return (
            <Async queries={{ query1 }} isFetching>
              {({
                queries: {
                  query1: { data }
                }
              }) => <div data-testid="data">{data}</div>}
            </Async>
          );
        };

        const { queryByTestId } = renderWithRQClient(
          queryClient,
          <AsyncProvider config={defaultConfig}>
            <Page />
          </AsyncProvider>
        );

        expect(queryByTestId('data')).toBeNull();

        await sleep(10);

        expect(queryByTestId('custom-fetching')).not.toBeNull();
      });

      it('Should use custom Error Component', async () => {
        const Page = () => {
          const query1 = useQuery('query1', () => mock({ isSuccess: false }), { retry: 0 });

          return (
            <Async queries={{ query1 }}>
              {({
                queries: {
                  query1: { data }
                }
              }) => <div data-testid="data">{data}</div>}
            </Async>
          );
        };

        const { queryByTestId, queryByText } = renderWithRQClient(
          queryClient,
          <AsyncProvider config={defaultConfig}>
            <Page />
          </AsyncProvider>
        );

        expect(queryByTestId('data')).toBeNull();
        expect(queryByTestId('custom-loading')).not.toBeNull();

        await sleep(10);

        expect(queryByTestId('custom-error')).not.toBeNull();
        expect(queryByTestId('data')).toBeNull();
        expect(queryByText('Foo Bar')).toBeNull();
      });

      it('Should use custom No Data Component', async () => {
        const Page = () => {
          const query1 = useQuery('query1', () => mock({ isSuccess: true, data: [] }), {
            retry: 0
          });

          return (
            <Async queries={{ query1 }}>
              {({
                queries: {
                  query1: { data }
                }
              }) => <div data-testid="data">{data}</div>}
            </Async>
          );
        };

        const { queryByTestId } = renderWithRQClient(
          queryClient,
          <AsyncProvider config={defaultConfig}>
            <Page />
          </AsyncProvider>
        );

        expect(queryByTestId('data')).toBeNull();
        expect(queryByTestId('custom-loading')).not.toBeNull();

        await sleep(10);

        expect(queryByTestId('custom-no-data')).not.toBeNull();
      });
    });
  });
});
