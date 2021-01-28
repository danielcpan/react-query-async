import React from 'react';
import useAsync from './useAsync';
import { useAsyncContext } from './AsyncProvider';
import { DEFAULT_COMPONENTS } from './constants';
import { IAsync } from './types';
import { flexRender, defaultMergeQueryStatesFn, defaultMergeMutationStatesFn } from './utils';

const Async: React.FC<IAsync> = props => {
  const { defaultConfig } = useAsyncContext();

  const { queries = {} } = props.queries || defaultConfig.queries;
  const { mutations = {} } = props.mutations || defaultConfig.mutations;
  const isLoading = props.isLoading || defaultConfig.isLoading;
  const isFetching = props.isFetching || defaultConfig.isFetching;
  const hasError = props.hasError || defaultConfig.hasError;
  const hasData = props.hasData || defaultConfig.hasData;
  const showFetching = props.showFetching || defaultConfig.showFetching;

  const { Loading, Fetching, Error, NoData } = {
    ...props.components,
    ...defaultConfig.components,
    ...DEFAULT_COMPONENTS
  } as any;

  const mergeQueryStatesFn =
    props.mergeQueryStatesFn || defaultConfig.mergeQueryStatesFn || defaultMergeQueryStatesFn;

  const mergeMutationStatesFn =
    props.mergeMutationStatesFn ||
    defaultConfig.mergeMutationStatesfn ||
    defaultMergeMutationStatesFn;

  const [queryState, mutationState] = useAsync({
    queries,
    mutations,
    mergeQueryStatesFn,
    mergeMutationStatesFn
  });

  const propsToPass = { queryState, mutationState, queries, mutations };
  const { children } = props;

  if (isLoading || queryState.isLoading || mutationState.isLoading) {
    return flexRender(Loading, { ...propsToPass, children });
  }

  if ((showFetching || isFetching) && (queryState.isFetching || mutationState.isFetching)) {
    return flexRender(Fetching, { ...propsToPass, children });
  }

  if (hasError || queryState.isError || mutationState.isError) {
    return flexRender(Error, { ...propsToPass, children });
  }

  if (hasData === false || (!queryState.hasData && !mutationState.hasData)) {
    return flexRender(NoData, { ...propsToPass, children });
  }

  return children(propsToPass);
};

const AsyncWithErrorBoundary = (props: any) => {
  const { ErrorBoundary } = props.components;

  if (ErrorBoundary) {
    return (
      <ErrorBoundary fallback={Error}>
        <Async {...props} />
      </ErrorBoundary>
    );
  }

  return <Async {...props} />;
};

export default AsyncWithErrorBoundary;
