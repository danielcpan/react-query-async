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
