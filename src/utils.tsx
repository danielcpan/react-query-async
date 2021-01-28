import React from 'react';

// Flexible render fn
export const flexRender = (Comp: any, props?: any) => {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp;
};

const isReactComponent = (component: any) => {
  return (
    isClassComponent(component) || typeof component === 'function' || isExoticComponent(component)
  );
};

const isClassComponent = (component: any) => {
  return (
    typeof component === 'function' &&
    (() => {
      const proto = Object.getPrototypeOf(component);
      return proto.prototype && proto.prototype.isReactComponent;
    })()
  );
};

const isExoticComponent = (component: any) => {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
  );
};

export const isFunction = (fnToCheck: any) => {
  return fnToCheck && {}.toString.call(fnToCheck) === '[object Function]';
};

const getStatus = ({ isIdle, isLoading, isError, isSuccess }: any) => {
  if (isIdle) return 'idle';
  if (isLoading) return 'loading';
  if (isError) return 'isError';
  if (isSuccess) return 'isSuccess';

  return 'unknown';
};

const isObject = (obj: any) => typeof obj === 'object' && obj !== null;

export const getHasData = (data: any): boolean => {
  if (Array.isArray(data)) return data.length > 0;
  if (isObject(data)) return Object.keys(data).length === 0;

  return data !== undefined;
};

export const defaultMergeQueryStatesFn = (queries: any) => {
  return Object.values(queries)
    .filter((el: any) => el.status !== 'idle')
    .reduce(
      (acc: any, el: any) => ({
        ...acc,
        isIdle: !!(acc.isIdle === undefined ? el.isIdle : acc.isIdle && el.isIdle),
        isLoading: !!(acc.isLoading || el.isLoading),
        isFetching: !!(acc.isFetching || el.isFetching),
        isError: !!(acc.isError || el.isError),
        isSuccess: !!(acc.isSuccess === undefined ? el.isSuccess : acc.isSuccess && el.isSuccess),
        hasData: !!(acc.hasData === undefined
          ? getHasData(el.data)
          : acc.hasData && getHasData(el.data)),
        status: getStatus({
          isIdle: el.isIdle,
          isLoading: el.isLoading,
          isError: el.isError,
          isSuccess: el.isSuccess
        })
      }),
      {}
    );
};

export const defaultMergeMutationStatesFn = (mutations: any) => {
  return Object.values(mutations)
    .filter((el: any) => el.status !== 'idle')
    .reduce(
      (acc: any, el: any) => ({
        ...acc,
        isIdle: !!(acc.isIdle === undefined ? el.isIdle : acc.isIdle && el.isIdle),
        isLoading: !!(acc.isLoading || el.isLoading),
        isPaused: !!(acc.isPaused || el.isPaused),
        isError: !!(acc.isError || el.isError),
        isSuccess: !!(acc.isSuccess === undefined ? el.isSuccess : acc.isSuccess && el.isSuccess),
        hasData: !!(acc.hasData === undefined
          ? el.data !== undefined
          : acc.hasData && getHasData(el.data)),
        status: getStatus({
          isIdle: el.isIdle,
          isLoading: el.isLoading,
          isError: el.isError,
          isSuccess: el.isSuccess
        })
      }),
      {}
    );
};
