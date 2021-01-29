import React from 'react';
import { fireEvent } from '@testing-library/react';
import { useQuery, QueryCache, QueryClient, useMutation } from 'react-query';
import { useAsync } from '../core';
import { mock, sleep, renderWithRQClient } from './utils';

import { RQ_LOADING_AND_FETCHING, RQ_LOADING, RQ_ERROR, RQ_SUCCESS } from './constants';

describe('useAsync', () => {
  describe('React Query', () => {
    const queryCache = new QueryCache();
    const queryClient = new QueryClient({ queryCache });

    beforeEach(() => {
      queryClient.clear();
    });

    describe('Queries only', () => {
      it('Should be loading until all non-idle operations have data', async () => {
        const states = [];

        const Page = () => {
          const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 1 }));
          const query2 = useQuery('query2', () => mock({ isSuccess: true, data: 1 }), {
            enabled: query1.isSuccess
          });
          const operations = useAsync({ queries: { query1, query2 } });

          states.push(operations);

          return null;
        };

        renderWithRQClient(queryClient, <Page />);

        await sleep(10);

        expect(states[0]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[1]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[2]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[3]).toMatchObject([RQ_SUCCESS, {}]);
        expect(states).toHaveLength(4);
      });

      it('Should error out if one non-idle fails', async () => {
        const states = [];

        const Page = () => {
          const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 1 }));
          const query2 = useQuery('query2', () => mock({ isSuccess: false }), { retry: 0 });
          const operations = useAsync({ queries: { query1, query2 } });

          states.push(operations);

          return null;
        };

        renderWithRQClient(queryClient, <Page />);

        await sleep(10);

        expect(states[0]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[1]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[2]).toMatchObject([RQ_ERROR, {}]);
        expect(states).toHaveLength(3);
      });
    });

    describe('Mutations only', () => {
      it('Should be loading until all non-idle operations have data', async () => {
        const states = [];

        const Page = () => {
          const mutation1 = useMutation(() => mock({ isSuccess: true, data: 'Foo' }));
          const mutation2 = useMutation(() => mock({ isSuccess: true, data: 'Bar' }));
          const operations = useAsync({ mutations: { mutation1, mutation2 } });

          states.push(operations);

          return (
            <div>
              <h1 data-testid="name">{`${mutation1?.data ?? ''} ${mutation2?.data ?? ''}`}</h1>
              <button onClick={() => mutation1.mutate()}>Get First Name</button>
              <button onClick={() => mutation2.mutate()}>Get Last Name</button>
            </div>
          );
        };

        const { getByTestId, getByText } = renderWithRQClient(queryClient, <Page />);

        expect(getByTestId('name').textContent).toBe(' ');
        fireEvent.click(getByText('Get First Name'));

        await sleep(10);

        expect(getByTestId('name').textContent).toContain('Foo');
        fireEvent.click(getByText('Get Last Name'));

        await sleep(10);

        expect(getByTestId('name').textContent).toContain('Bar');
        expect(states[0]).toMatchObject([{}, {}]);
        expect(states[1]).toMatchObject([{}, RQ_LOADING]);
        expect(states[2]).toMatchObject([{}, RQ_SUCCESS]);
        expect(states[3]).toMatchObject([{}, RQ_LOADING]);
        expect(states[4]).toMatchObject([{}, RQ_SUCCESS]);
        expect(states).toHaveLength(5);
      });

      it('Should error out if one non-idle fails', async () => {
        const states = [];

        const Page = () => {
          const mutation1 = useMutation(() => mock({ isSuccess: true, data: 'Foo' }));
          const mutation2 = useMutation(() => mock({ isSuccess: false }));
          const operations = useAsync({ mutations: { mutation1, mutation2 } });

          states.push(operations);

          return (
            <div>
              <h1 data-testid="name">{`${mutation1?.data ?? ''} ${mutation2?.data ?? ''}`}</h1>
              <button onClick={() => mutation1.mutate()}>Get First Name</button>
              <button onClick={() => mutation2.mutate()}>Get Last Name</button>
            </div>
          );
        };

        const { getByTestId, getByText } = renderWithRQClient(queryClient, <Page />);

        expect(getByTestId('name').textContent).toBe(' ');
        fireEvent.click(getByText('Get First Name'));

        await sleep(10);

        expect(getByTestId('name').textContent).toContain('Foo');
        fireEvent.click(getByText('Get Last Name'));

        await sleep(10);

        expect(getByTestId('name').textContent).not.toContain('Bar');
        expect(states[0]).toMatchObject([{}, {}]);
        expect(states[1]).toMatchObject([{}, RQ_LOADING]);
        expect(states[2]).toMatchObject([{}, RQ_SUCCESS]);
        expect(states[3]).toMatchObject([{}, RQ_LOADING]);
        expect(states[4]).toMatchObject([{}, RQ_ERROR]);
        expect(states).toHaveLength(5);
      });
    });

    describe('Queries and mutations', () => {
      it('Should be loading until all non-idle operations have data', async () => {
        const states = [];
        const Page = () => {
          const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 1 }));
          const query2 = useQuery('query2', () => mock({ isSuccess: true, data: 1 }), {
            enabled: query1.isSuccess
          });

          const mutation1 = useMutation(() => mock({ isSuccess: true, data: 'Foo' }));
          const mutation2 = useMutation(() => mock({ isSuccess: true, data: 'Bar' }));

          const operations = useAsync({
            queries: { query1, query2 },
            mutations: { mutation1, mutation2 }
          });

          states.push(operations);

          return (
            <div>
              <h1 data-testid="name">{`${mutation1?.data ?? ''} ${mutation2?.data ?? ''}`}</h1>
              <button onClick={() => mutation1.mutate()}>Get First Name</button>
              <button onClick={() => mutation2.mutate()}>Get Last Name</button>
            </div>
          );
        };
        const { getByTestId, getByText } = renderWithRQClient(queryClient, <Page />);

        await sleep(10);

        expect(getByTestId('name').textContent).toBe(' ');
        fireEvent.click(getByText('Get First Name'));

        await sleep(10);

        expect(getByTestId('name').textContent).toContain('Foo');
        fireEvent.click(getByText('Get Last Name'));

        await sleep(10);

        expect(getByTestId('name').textContent).toContain('Bar');

        expect(states[0]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[1]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[2]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[3]).toMatchObject([RQ_SUCCESS, {}]);
        expect(states[4]).toMatchObject([RQ_SUCCESS, RQ_LOADING]);
        expect(states[5]).toMatchObject([RQ_SUCCESS, RQ_SUCCESS]);
        expect(states[6]).toMatchObject([RQ_SUCCESS, RQ_LOADING]);
        expect(states[7]).toMatchObject([RQ_SUCCESS, RQ_SUCCESS]);
        expect(states).toHaveLength(8);
      });

      it('Should error out if one non-idle fails', async () => {
        const states = [];
        const Page = () => {
          const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 1 }));
          const query2 = useQuery('query2', () => mock({ isSuccess: false }), {
            enabled: query1.isSuccess,
            retry: 0
          });

          const mutation1 = useMutation(() => mock({ isSuccess: true, data: 'Foo' }));
          const mutation2 = useMutation(() => mock({ isSuccess: false }));

          const operations = useAsync({
            queries: { query1, query2 },
            mutations: { mutation1, mutation2 }
          });

          states.push(operations);

          return (
            <div>
              <h1 data-testid="name">{`${mutation1?.data ?? ''} ${mutation2?.data ?? ''}`}</h1>
              <button onClick={() => mutation1.mutate()}>Get First Name</button>
              <button onClick={() => mutation2.mutate()}>Get Last Name</button>
            </div>
          );
        };
        const { getByTestId, getByText } = renderWithRQClient(queryClient, <Page />);

        await sleep(10);

        expect(getByTestId('name').textContent).toBe(' ');
        fireEvent.click(getByText('Get First Name'));

        await sleep(10);

        expect(getByTestId('name').textContent).toContain('Foo');
        fireEvent.click(getByText('Get Last Name'));

        await sleep(10);

        expect(getByTestId('name').textContent).not.toContain('Bar');

        expect(states[0]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[1]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[2]).toMatchObject([RQ_LOADING_AND_FETCHING, {}]);
        expect(states[3]).toMatchObject([RQ_ERROR, {}]);
        expect(states[4]).toMatchObject([RQ_ERROR, RQ_LOADING]);
        expect(states[5]).toMatchObject([RQ_ERROR, RQ_SUCCESS]);
        expect(states[6]).toMatchObject([RQ_ERROR, RQ_LOADING]);
        expect(states[7]).toMatchObject([RQ_ERROR, RQ_ERROR]);
        expect(states).toHaveLength(8);
      });
    });
  });
});
