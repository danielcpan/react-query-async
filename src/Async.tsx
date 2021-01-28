import React from 'react';
import useAsync from './useAsync';
import { useAsyncContext } from './AsyncProvider';
import { DEFAULT_COMPONENTS } from './constants';
import { AsyncProps, PropsToPass } from './types';
import { flexRender, RQMergeStatesFn } from './utils';

const Async: React.FC<AsyncProps> = props => {
  const config = useAsyncContext();

  const { queries = {} } = props.queries || config.queries;
  const { mutations = {} } = props.mutations || config.mutations;
  const isLoading = props.isLoading || config.isLoading;
  const isFetching = props.isFetching || config.isFetching;
  const hasError = props.hasError || config.hasError;
  const hasData = props.hasData || config.hasData;
  const showFetching = props.showFetching || config.showFetching;

  const { Loading, Fetching, Error, NoData } = {
    ...props.components,
    ...config.components,
    ...DEFAULT_COMPONENTS
  } as any;

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

  if (isLoading || queryState.isLoading || mutationState.isLoading) {
    return flexRender(Loading, { ...propsToPass, children });
  }

  if ((showFetching || isFetching) && (queryState.isFetching || mutationState.isFetching)) {
    return flexRender(Fetching, { ...propsToPass, children });
  }

  if (hasError || queryState.hasError || mutationState.hasError) {
    return flexRender(Error, { ...propsToPass, children });
  }

  if (hasData === false || (!queryState.hasData && !mutationState.hasData)) {
    return flexRender(NoData, { ...propsToPass, children });
  }

  return children(propsToPass);
};

const AsyncWithErrorBoundary = (props: any) => {
  const config = useAsyncContext() as any;
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
