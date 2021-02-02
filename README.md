# React-Query-Async

A HOC utility tool built for [react-query](https://www.npmjs.com/package/react-query) however also supports [swr](https://www.npmjs.com/package/swr) and [@apollo/graphql](https://www.npmjs.com/package/@apollo/graphql) as well as any custom data fetch hook. 

## Features

- Async (HOC)
- useAsync (Hook)
- AsyncProvider (Config exposed to all instances of Async and useAsync)

## Usage with React-Query

### Without Async

```tsx
import { useQuery, useMutation } from "react-query"

const Loading = () => <div>Loading</div>;
const Error = () => <div>Error</div>;
const NoData = () => <div>No Data</div>;

const App = () => {
  const todosQuery = useQuery('todos', () => API.getTodos());
  const { mutate, ...createTodoMutation } = useMutation(API.createTodo);
  
  if (todosQuery.isLoading || createTodoMutation.isLoading) return <Loading />
  
  if (todosQuery.isError || createTodoMutation.isError) return <Error />
  
  if (!!todosQuery.data) return <NoData />
  
  const { data: todos } = todosQuery;
  
  return (
    <>
      {todos.map(todo => <div>{todo.name}</div>)}
      
      <button 
        onClick={() => {
          mutate({ name: "I'm a new Todo!"})
        }}
      >
        Create New Todo
      </button>
    </>    
  )
};
```

### With Async

Instead of having to constantly define stateful views, write it once and feed it into the Async HOC. Wrap your code with the Async HOC and it will do the rest.

```tsx
import { Async } from "react-query-async"
import { useQuery, useMutation } from "react-query"

const Loading = () => <div>Loading</div>;
const Error = () => <div>Error</div>;
const NoData = () => <div>No Data</div>;

const App = () => {
  const todosQuery = useQuery('todos', () => API.getTodos());
  const { mutate, ...createTodoMutation} = useMutation(API.createTodo);

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
          {todos.map(todo => <div>{todo.name}</div>)}
          <button 
            onClick={() => {
              mutate({ name: "I'm a new Todo!"})
            }}
          >
            Create New Todo
          </button>
        </>
      )}
    </Async>
  );
};
```

### With AsyncProvider

###### Don't want to supplement the components prop everytime? Set up the config to whatever you want with.

```tsx
import { Async } from "react-query-async"

const Loading = () => <div>Loading</div>;
const Fetching = () => <div>Fetching</div>;
const Error = () => <div>Error</div>;
const NoData = () => <div>No Data</div>;

const config = {
  showFetching: true,
  components: { Loading, Error, NoData, Fetching }  
}

ReactDOM.render( 
  <AsyncProvider config={config}> // Config will be passed to all instances of Async
    <App />
  </AsyncProvider>,
document.getElementById('root')
);
```



## API

### Async

```tsx
<Async 
  queries={{ query1, query2 }} 
  mutations={{ mutation1 }} 
  showFetching 
  components={{ 
    Loading: () => "Custom Loading", // Supports React Components or 
    Fetching: "Fetching!" // even just a string!
  }}
  ErrorBoundary={MyCustomErrorBoundary} // Wrap instance with your own error boundary
>
  {({
   queries,
   mutations,
   queryState,
   mutationState.
  }) => "Data here!"}
</Async>
```

#####   Parameters

- ```queries?: any```
  - Any async operation that fetches data
  - Takes in a key value hash i.e ```queries={{ todosQuery, postsQuery }}```
- ```mutations?: any```
  - Any async operation that updates data
  - Takes in a key value hash i.e ```mutations={{ addTodosMutation, deleteTodoMutation }}```
- ```isLoading?: boolean | (() => boolean)```
- ```isFetching?: boolean | (() => boolean)```
- ```hasError?: boolean | (() => boolean)```
- ```hasData?: boolean | (() => boolean)```
- ```showFetching?: boolean```
  
  - By default **false** so Fetch State will not be displayed
- ```components?: DefaultComponents```
  - ```DefaultComponents```
    - ```Loading: ({ queryState, mutationState, queries, mutations }) => any | React.ReactNode | string```
    - ```Fetching: ({ queryState, mutationState, queries, mutations }) => any | React.ReactNode | string```
    - ```Error: ({ queryState, mutationState, queries, mutations }) => any | React.ReactNode | string```
    - ```NoData: ({ queryState, mutationState, queries, mutations }) => any | React.ReactNode | string```
  - Feel free to configure state to whatever you want. All the information you need is passed back so it's as flexible as possible
- ```mergeQueryStatesFn?: (operations: any) => OperationState```

  - Out of the box it is defaulted to support [react-query](https://www.npmjs.com/package/react-query) however see Examples to configure to [swr](https://www.npmjs.com/package/swr), [@apollo/graphql](https://www.npmjs.com/package/@apollo/graphql) or any custom hook! 

  - Any custom hook supported as long as it returns:

    - isLoading
    - hasError
    - hasData
    - isFetching - Optional

  - React Query Example - Default used

    ```tsx
    const RQMergeStatesFn = (operations: any) => {
      return Object.values(operations)
        .filter((el: any) => el.status !== 'idle')
        .reduce(
          (acc: any, el: any) => ({
            ...acc,
            isLoading: !!(acc.isLoading || el.isLoading),
            isPaused: !!(acc.isPaused || el.isPaused),
            isFetching: !!(acc.isFetching || el.isFetching),
            hasError: !!(acc.hasError || el.isError),
            isSuccess: !!(acc.isSuccess === undefined ? el.isSuccess : acc.isSuccess && el.isSuccess),
            hasData: !!(acc.hasData === undefined
              ? getHasData(el.data)
              : acc.hasData && getHasData(el.data)),
            status: getStatus({
              isLoading: acc.isLoading || el.isLoading,
              hasError: acc.hasError || el.isError,
              isSuccess: acc.isSuccess === undefined ? el.isSuccess : acc.isSuccess && el.isSuccess
            })
          }),
          {}
        ) as OperationState;
    };
    ```
- ```mergeMutationStatesFn?: (operations: any) => OperationState```
  
  - Out of the box it is defaulted to support [react-query](https://www.npmjs.com/package/react-query) however see Examples to configure to [swr](https://www.npmjs.com/package/swr), [@apollo/graphql](https://www.npmjs.com/package/@apollo/graphql) or any custom hook!
  - Any custom hook supported as long as it returns:
    - isLoading
    - hasError
    - hasData
    - isFetching - Optional
- ```ErrorBoundary?: any```
  
  - In case you want each instance of the Async HOC to have an Error Boundary as a fall back.
- ```errorBoundaryProps?: any```
  
  - Props to be passed to ErrorBoundary

##### Returns

- ```queryState: OperationState```
  - The state of all queries
  - OperationState
    - **isLoading** if at least 1 query is loading 
    - **isFetching** if at least 1 query is fetching 
    - **hasError** if at least 1 query has error 
    - **hasData** if at least 1 query has no Data 
- ```mutationState: OperationState```
  - The state of all mutations
  - OperationState
    - **isLoading** if at least 1 query is loading 
    - **isFetching** if at least 1 query is fetching 
    - **hasError** if at least 1 query has error 
    - **hasData** if at least 1 query has no Data 
- ```queries: any```
  - Same as Params
- ```mutations: any```
  - Same as Params

### useAsync

```tsx
const [queryState, mutationState] = useAsync({ queries: { query1, query2 }, mutations: { mutation1 }})
```

#####   Parameters

- ```queries?: any```
  - Same as Async
- ```mutations?: any```
  - Same as Async
- ```mergeQueryStatesFn?: (operations: any) => OperationState```
  - Same as Async
- ```mergeMutationStatesFn?: (operations: any) => OperationState```
  - Same as Async

##### Returns

- ```queryState: OperationState```
  - The state of all queries
  - OperationState
    - **isLoading** if at least 1 query is loading 
    - **isFetching** if at least 1 query is fetching 
    - **hasError** if at least 1 query has error 
    - **NoData** if at least 1 query has no Data 
- ```mutationState: OperationState```
  - The state of all mutations
  - OperationState
    - **isLoading** if at least 1 query is loading 
    - **isFetching** if at least 1 query is fetching 
    - **hasError** if at least 1 query has error 
    - **NoData** if at least 1 query has no Data 

#### AsyncProvider

```tsx
<AsyncProvider 
  config={
    showFetching: false,
    components={{
      Loading: "Custom Loading",
      Fetching: "Custom Fetching",
      Error: () => "Custom Error",
      NoData: () => "Custom No Data"
    }}
    mergeQueryStatesFn={customMergeFn}
    mergeMutationStatesFn={customMergeFn}
    ErrorBoundary={MyCustomErrorBoundary}
    errorBoundaryProps={ fallback: "I'm an error fallback"}
  }
>
  <App />
</AsyncProvider>
```

- ```config  ```
  - Same as Async

## Quick Setup

```tsx
import { RQMergeStatesFn, SWRMergeStatesFn, GQLMergeStatesFn } from "react-query-async" 
```

Out of the box configured with RQMergeStatesFn which supports react-query however SWRMergeStatesFn and GQLMergeStatesFn provided for convenience. The latter two have not been fully tested yet.

## Examples

- [Basic w/ React-Query](https://codesandbox.io/s/basic-usage-with-react-query-cxd44?file=/src/App.js)
- [Basic w/ Custom Hooks](https://codesandbox.io/s/basic-w-custom-hooks-3uoxc?file=/src/App.js)
- More to come...

