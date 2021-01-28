import React from 'react';
import { OperationState } from './types';

export const flexRender = (Comp: any, props?: any) => {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp;
};

export const isReactComponent = (comp: any) => {
  return isClassComponent(comp) || typeof comp === 'function' || isExoticComponent(comp);
};

export const isClassComponent = (comp: any) => {
  return (
    typeof comp === 'function' &&
    (() => !!Object.getPrototypeOf(comp)?.prototype?.isReactComponent)()
  );
};

export const isExoticComponent = (comp: any) => {
  return (
    typeof comp === 'object' &&
    typeof comp.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(comp.$$typeof.description)
  );
};

export const isFunction = (fn: any) => fn && {}.toString.call(fn) === '[object Function]';

export const isObject = (obj: any) => typeof obj === 'object' && obj !== null;

const getStatus = ({ isLoading, isError, isSuccess }: any) => {
  if (isLoading) return 'loading';
  if (isError) return 'isError';
  if (isSuccess) return 'isSuccess';

  return 'unknown';
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
          isLoading: el.isLoading,
          hasError: el.isError,
          isSuccess: el.isSuccess
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
