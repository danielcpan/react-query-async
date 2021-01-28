export interface DefaultComponents {
  Loading: () => any | React.ReactNode | string;
  Fetching: () => any | React.ReactNode | string;
  Error: () => any | React.ReactNode | string;
  NoData: () => any | React.ReactNode | string;
}

export interface OperationState {
  isLoading: boolean;
  isFetching: boolean;
  hasError: boolean;
  hasData: boolean;
}

export interface AsyncProps {
  queries?: any;
  mutations?: any;
  isLoading?: boolean | (() => boolean);
  isFetching?: boolean | (() => boolean);
  hasError?: boolean | (() => boolean);
  hasData?: boolean | (() => boolean);
  showIdle?: boolean | (() => boolean);
  showFetching?: boolean | (() => boolean);
  components?: DefaultComponents;
  mergeQueryStatesFn?: (operations: any) => OperationState;
  mergeMutationStatesFn?: (operations: any) => OperationState;
  children: (props: any) => React.ReactNode;
}

export interface PropsToPass {
  queries: any;
  mutations: any;
  queryState: OperationState;
  mutationState: OperationState;
}

export interface IAsyncProvider {
  config?: AsyncProps;
}
