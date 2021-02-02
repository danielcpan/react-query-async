import React from 'react';
import useAsync from './useAsync';
import { useAsyncContext } from './AsyncProvider';
import { DEFAULT_COMPONENTS } from './constants';
import {
  getComponentIsLoading,
  getComponentIsFetching,
  getComponentHasError,
  getComponentHasData,
  flexRender,
  RQMergeStatesFn
} from './utils';
import { AsyncProps, PropsToPass, DefaultComponents } from './types';

const Async: React.FC<AsyncProps> = props => {
  const config = useAsyncContext();

  const queries = props.queries || config.queries || {};
  const mutations = props.mutations || config.mutations || {};
  const isLoading = props.isLoading || config.isLoading;
  const isFetching = props.isFetching || config.isFetching;
  const hasError = props.hasError || config.hasError;
  const hasData = props.hasData || config.hasData;
  const showFetching = props.showFetching || config.showFetching;

  const { Loading, Fetching, Error, NoData }: DefaultComponents = {
    ...DEFAULT_COMPONENTS,
    ...config.components,
    ...props.components
  };

  const mergeQueryStatesFn =
    props.mergeQueryStatesFn || config.mergeQueryStatesFn || RQMergeStatesFn;

  const mergeMutationStatesFn =
    props.mergeMutationStatesFn || config.mergeMutationStatesfn || RQMergeStatesFn;

  const [queryState, mutationState] = useAsync({
    queries,
    mutations,
    mergeQueryStatesFn,
    mergeMutationStatesFn
  });

  const propsToPass = { queryState, mutationState, queries, mutations } as PropsToPass;
  const { children } = props;

  if (getComponentIsLoading(isLoading, queryState, mutationState)) {
    return flexRender(Loading, { ...propsToPass, children });
  }

  if (
    (showFetching || isFetching) &&
    getComponentIsFetching(isFetching, queryState, mutationState)
  ) {
    return flexRender(Fetching, { ...propsToPass, children });
  }

  if (getComponentHasError(hasError, queryState, mutationState)) {
    return flexRender(Error, { ...propsToPass, children });
  }

  if (!getComponentHasData(hasData, queryState, mutationState)) {
    return flexRender(NoData, { ...propsToPass, children });
  }

  return children(propsToPass);
};

const AsyncWithErrorBoundary = (props: AsyncProps) => {
  const config = useAsyncContext();
  const { ErrorBoundary, errorBoundaryProps } = props || config;

  if (ErrorBoundary) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Async {...props} />
      </ErrorBoundary>
    );
  }

  return <Async {...props} />;
};

export default AsyncWithErrorBoundary;
