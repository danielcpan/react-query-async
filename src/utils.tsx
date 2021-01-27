import React from 'react';

interface IGetHookVals {
  queries: any;
  mutations: any;
}

const isExoticComponent = (component: any) => (
  typeof component === 'object'
    && typeof component.$$typeof === 'symbol'
    && ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
);

const isClassComponent = (component: any) => (
  typeof component === 'function'
    && (() => {
      const proto = Object.getPrototypeOf(component);
      return proto.prototype && proto.prototype.isReactComponent;
    })()
);

const isReactComponent = (component: any) => (
  isClassComponent(component) || typeof component === 'function' || isExoticComponent(component)
);

// Flexible render fn
export const flexRender = (Comp: any, props?: any) => (isReactComponent(Comp) ? <Comp {...props} /> : Comp
);

export const isFunction = (fn: any) => fn && {}.toString.call(fn) === '[object Function]';

export const getHookVals = ({ queries, mutations }: IGetHookVals) => {
  const queryVals = Object.values(queries).filter((el: any) => el.status !== 'idle');
  const mutationVals = Object.values(mutations).filter((el: any) => el.status !== 'idle');
  const hookVals = [...queryVals, ...mutationVals];

  return { hookVals, queryVals, mutationVals };
};

interface IGetComponentState {
  isLoading?: boolean | (() => boolean) | any;
  isFetching?: boolean | (() => boolean) | any;
  hasError?: boolean | (() => boolean) | any;
  hasData?: boolean | (() => boolean) | any;
  hookVals: any;
}

export const getIsLoading = (hook: any): boolean => {
  if (Array.isArray(hook)) {
    return hook.some((el) => el.status === 'loading');
  }

  return hook.status === 'loading';
};

export const getIsFetching = (hook: any): boolean => {
  if (Array.isArray(hook)) {
    return hook.some((el) => el.isFetching);
  }

  return hook.isFetching;
};

export const getHasError = (hook: any): boolean => {
  if (Array.isArray(hook)) {
    return hook.some((el) => el.error);
  }

  return !!hook.error;
};

export const getHasData = (hook: any): boolean => {
  if (Array.isArray(hook)) {
    return hook.every((el) => (Array.isArray(el.data) ? el.data.length > 0 : !!el.data));
  }

  return Array.isArray(hook.data) ? hook.data.length > 0 : !!hook.data;
};

export const getErrors = (hook: any): unknown => {
  if (Array.isArray(hook)) {
    return hook.reduce((acc, el) => {
      if (el.error) acc.push(el.error);
      return acc;
    }, []);
  }

  return hook.error;
};

export const getComponentIsLoading = ({ isLoading, hookVals }: IGetComponentState) => {
  if (isLoading !== undefined) {
    return (isFunction(isLoading) && isLoading()) || isLoading;
  }

  return getIsLoading(hookVals);
};
export const getComponentIsFetching = ({ isFetching, hookVals }: IGetComponentState) => {
  if (isFetching !== undefined) {
    return (isFunction(isFetching) && isFetching()) || isFetching;
  }

  return getIsFetching(hookVals);
};
export const getComponentHasError = ({ hasError, hookVals }: IGetComponentState) => {
  if (hasError !== undefined) {
    return (isFunction(hasError) && hasError()) || hasError;
  }

  return getHasError(hookVals);
};

export const getComponentHasData = ({ hasData, hookVals }: IGetComponentState) => {
  if (hasData !== undefined) {
    return (isFunction(hasData) && hasData()) || hasData;
  }

  return getHasData(hookVals);
};
