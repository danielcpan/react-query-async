import React from 'react';
import { OperationState, Status } from './types';

export const flexRender = (Comp: any, props?: any): any => {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp;
};

export const isReactComponent = (comp: any): boolean => {
  return isClassComponent(comp) || typeof comp === 'function' || isExoticComponent(comp);
};

export const isClassComponent = (comp: any): boolean => {
  return (
    typeof comp === 'function' &&
    (() => !!Object.getPrototypeOf(comp)?.prototype?.isReactComponent)()
  );
};

export const isExoticComponent = (comp: any): boolean => {
  return (
    typeof comp === 'object' &&
    typeof comp.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(comp.$$typeof.description)
  );
};

export const isFunction = (fn: any): boolean => fn && {}.toString.call(fn) === '[object Function]';

export const isObject = (obj: any): boolean => typeof obj === 'object' && obj !== null;

export const getComponentIsLoading = (
  isLoading: () => boolean | boolean | undefined,
  queryState: OperationState,
  mutationState: OperationState
) => {
  if (isLoading !== undefined) {
    return !!((isFunction(isLoading) && isLoading()) || isLoading);
  }

  return queryState.isLoading || mutationState.isLoading;
};

export const getComponentIsFetching = (
  isFetching: () => boolean | boolean | undefined,
  queryState: OperationState,
  mutationState: OperationState
): boolean => {
  if (isFetching !== undefined) {
    return !!((isFunction(isFetching) && isFetching()) || isFetching);
  }

  return queryState.isFetching || mutationState.isFetching;
};

export const getComponentHasError = (
  hasError: () => boolean | boolean | undefined,
  queryState: OperationState,
  mutationState: OperationState
) => {
  if (hasError !== undefined) {
    return !!((isFunction(hasError) && hasError()) || hasError);
  }

  return queryState.hasError || mutationState.hasError;
};

export const getComponentHasData = (
  hasData: () => boolean | boolean | undefined,
  queryState: OperationState,
  mutationState: OperationState
) => {
  if (hasData !== undefined) {
    return !!((isFunction(hasData) && hasData()) || hasData);
  }

  // Let empty idle states pass
  if (Object.keys(queryState).length === 0 && Object.keys(mutationState).length === 0) return true;

  return queryState.hasData || mutationState.hasData;
};
const getStatus = ({ isLoading, hasError, isSuccess }: any): Status => {
  if (isLoading) return 'loading';
  if (hasError) return 'error';
  if (isSuccess) return 'success';

  return 'idle';
};

export const getHasData = (data: any): boolean => {
  if (Array.isArray(data)) return data.length > 0;
  if (isObject(data)) return Object.keys(data).length > 0;

  return data !== undefined && data !== null;
};

export const RQMergeStatesFn = (operations: any) => {
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

export const SWRMergeStatesFn = (operations: any) => {
  return Object.values(operations).reduce(
    (acc: any, el: any) => ({
      ...acc,
      isLoading: !!(acc.isLoading || el.isValidating),
      hasError: !!(acc.hasError || !!el.error),
      isSuccess: !!(acc.isSuccess === undefined
        ? getHasData(el.data)
        : acc.isSuccess && getHasData(el.data)),
      hasData: !!(acc.hasData === undefined
        ? el.data !== undefined
        : acc.hasData && getHasData(el.data))
    }),
    {}
  ) as OperationState;
};

export const GQLMergeStatesFn = (operations: any) => {
  return Object.values(operations).reduce(
    (acc: any, el: any) => ({
      ...acc,
      isLoading: !!(acc.isLoading || el.loading),
      hasError: !!(acc.hasError || !!el.error),
      isSuccess: !!(acc.isSuccess === undefined
        ? getHasData(el.data)
        : acc.isSuccess && getHasData(el.data)),
      hasData: !!(acc.hasData === undefined
        ? el.data !== undefined
        : acc.hasData && getHasData(el.data))
    }),
    {}
  ) as OperationState;
};
