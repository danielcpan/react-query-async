/* eslint-disable react/display-name */
import React from 'react';
import { useQuery, QueryCache, QueryClient } from 'react-query';
import { Async } from '../core';
import { mock, sleep, renderWithRQClient } from './utils';

describe('AsyncProvider', () => {
  const defaultComponents = {
    Loading: <div data-testid="custom-loading">Custom Loading</div>,
    Fetching: <div data-testid="custom-fetching">Custom Fetching</div>,
    Error: <div data-testid="custom-error">Custom Error</div>,
    NoData: <div data-testid="custom-no-data">Custom No Data</div>
  };
  const queryCache = new QueryCache();
  const queryClient = new QueryClient({ queryCache });

  beforeEach(() => {
    queryClient.clear();
  });

  describe('Provider config should be used if props are not set for an individual Async', () => {
    it('Should use custom Loading Component', async () => {
      const Page = () => {
        const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 'Foo Bar' }));

        return (
          <Async
            queries={{ query1 }}
            components={{ Loading: <div data-testid="custom-loading">Custom Loading</div> }}
          >
            {({
              queries: {
                query1: { data }
              }
            }) => <div data-testid="data">{data}</div>}
          </Async>
        );
      };

      const { queryByTestId, queryByText } = renderWithRQClient(queryClient, <Page />);

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
          <Async queries={{ query1 }} isFetching components={defaultComponents}>
            {({
              queries: {
                query1: { data }
              }
            }) => <div data-testid="data">{data}</div>}
          </Async>
        );
      };

      const { queryByTestId } = renderWithRQClient(queryClient, <Page />);

      expect(queryByTestId('data')).toBeNull();

      await sleep(10);

      expect(queryByTestId('custom-fetching')).not.toBeNull();
    });

    it('Should use custom Error Component', async () => {
      const Page = () => {
        const query1 = useQuery('query1', () => mock({ isSuccess: false }), { retry: 0 });

        return (
          <Async queries={{ query1 }} components={defaultComponents}>
            {({
              queries: {
                query1: { data }
              }
            }) => <div data-testid="data">{data}</div>}
          </Async>
        );
      };

      const { queryByTestId, queryByText } = renderWithRQClient(queryClient, <Page />);

      expect(queryByTestId('data')).toBeNull();

      await sleep(10);

      expect(queryByTestId('custom-error')).not.toBeNull();
      expect(queryByTestId('data')).toBeNull();
      expect(queryByText('Foo Bar')).toBeNull();
    });

    it('Should use custom No Data Component', async () => {
      const Loading = () => <div>Loading</div>;
      const Error = () => <div>Error</div>;
      const NoData = () => <div>No Data</div>;

      const App = () => {
        const todosQuery = useQuery('todos', () => API.getTodos());
        const { mutate, ...createTodoMutation } = useMutation(API.createTodo);

        return (
          <Async
            queries={{ todosQuery }}
            mutations={{ createTodoMutation }}
            components={{ Loading, Error, NoData }}
          >
            {({
              queries: {
                todosQuery: { data: todos }
              }
            }) => (
              <>
                {todos.map(todo => (
                  <div>{todo.name}</div>
                ))}
                <button
                  onClick={() => {
                    mutate({ name: "I'm a new Todo!" });
                  }}
                >
                  Create New Todo
                </button>
              </>
            )}
          </Async>
        );
      };

      const Page = () => {
        const query1 = useQuery('query1', () => mock({ isSuccess: true, data: [] }), {
          retry: 0
        });

        return (
          <Async queries={{ query1 }} components={defaultComponents}>
            {({
              queries: {
                query1: { data }
              }
            }) => <div data-testid="data">{data}</div>}
          </Async>
        );
      };

      const { queryByTestId } = renderWithRQClient(queryClient, <Page />);

      expect(queryByTestId('data')).toBeNull();

      await sleep(10);

      expect(queryByTestId('custom-no-data')).not.toBeNull();
    });
  });

  describe('Manual controls should support both booleans and functions that resolve to booleans', () => {
    it('should support isLoading function', async () => {
      const Page = () => {
        const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 'Foo Bar' }), {
          retry: 0
        });

        return (
          <Async queries={{ query1 }} components={defaultComponents} isLoading={() => true}>
            {({
              queries: {
                query1: { data }
              }
            }) => <div data-testid="data">{data}</div>}
          </Async>
        );
      };

      const { queryByTestId } = renderWithRQClient(queryClient, <Page />);

      expect(queryByTestId('data')).toBeNull();
      expect(queryByTestId('custom-loading')).not.toBeNull();
    });

    it('should support isFetching function', async () => {
      const Page = () => {
        const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 'Foo Bar' }), {
          retry: 0
        });

        return (
          <Async queries={{ query1 }} components={defaultComponents} isFetching={() => true}>
            {({
              queries: {
                query1: { data }
              }
            }) => <div data-testid="data">{data}</div>}
          </Async>
        );
      };

      const { queryByTestId } = renderWithRQClient(queryClient, <Page />);

      expect(queryByTestId('data')).toBeNull();
      expect(queryByTestId('custom-loading')).not.toBeNull();
    });

    it('should support hasError function', async () => {
      const Page = () => {
        const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 'Foo Bar' }), {
          retry: 0
        });

        return (
          <Async queries={{ query1 }} components={defaultComponents} hasError={() => true}>
            {({
              queries: {
                query1: { data }
              }
            }) => <div data-testid="data">{data}</div>}
          </Async>
        );
      };

      const { queryByTestId } = renderWithRQClient(queryClient, <Page />);

      expect(queryByTestId('data')).toBeNull();
      expect(queryByTestId('custom-loading')).not.toBeNull();
    });

    it('should support hasData function', async () => {
      const Page = () => {
        const query1 = useQuery('query1', () => mock({ isSuccess: true, data: 'Foo Bar' }), {
          retry: 0
        });

        return (
          <Async
            queries={{ query1 }}
            components={{ Loading: <div data-testid="custom-loading">Custom Loading</div> }}
            hasData={() => true}
          >
            {({
              queries: {
                query1: { data }
              }
            }) => <div data-testid="data">{data}</div>}
          </Async>
        );
      };

      const { queryByTestId } = renderWithRQClient(queryClient, <Page />);

      expect(queryByTestId('data')).toBeNull();
      expect(queryByTestId('custom-loading')).not.toBeNull();
    });
  });
});
