export interface DefaultComponents {
  Loading?: ((props: PropsToPass) => any) | React.ReactNode | string;
  Fetching?: ((props: PropsToPass) => any) | React.ReactNode | string;
  Error?: ((props: PropsToPass) => any) | React.ReactNode | string;
  NoData?: ((props: PropsToPass) => any) | React.ReactNode | string;
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
  showFetching?: boolean;
  components?: DefaultComponents;
  mergeQueryStatesFn?: (operations: any) => OperationState;
  mergeMutationStatesFn?: (operations: any) => OperationState;
  ErrorBoundary?: any;
  errorBoundaryProps?: any;
  children: (props: any) => React.ReactNode;
}

export interface UseAsyncProps {
  queries?: any;
  mutations?: any;
  mergeQueryStatesFn?: (operations: any) => OperationState;
  mergeMutationStatesFn?: (operations: any) => OperationState;
}

export interface PropsToPass {
  queries: any;
  mutations: any;
  queryState: OperationState;
  mutationState: OperationState;
}

export interface Config {
  showFetching?: boolean;
  components?: DefaultComponents;
  mergeQueryStatesFn?: (operations: any) => OperationState;
  mergeMutationStatesFn?: (operations: any) => OperationState;
  ErrorBoundary?: any;
  errorBoundaryProps?: any;
}

export interface AsyncProviderProps {
  config?: Config;
}

export type Status = 'loading' | 'error' | 'success' | 'idle';
