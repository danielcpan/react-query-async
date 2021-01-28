export interface IAsyncDefaultComponents {
  Loading: () => any | React.ReactNode | string;
  Fetching: () => any | React.ReactNode | string;
  Error: () => any | React.ReactNode | string;
  NoData: () => any | React.ReactNode | string;
}

export interface IAsync {
  queries?: any;
  mutations?: any;
  isLoading?: boolean | (() => boolean);
  isFetching?: boolean | (() => boolean);
  hasError?: boolean | (() => boolean);
  hasData?: boolean | (() => boolean);
  showIdle?: boolean;
  showFetching?: boolean;
  components?: IAsyncDefaultComponents;
  mergeStateFn?: () => any;
  mergeQueryStatesFn?: () => any;
  mergeMutationStatesFn?: () => any;
  children: (props: any) => React.ReactNode;
}
