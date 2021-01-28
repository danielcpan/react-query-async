import { defaultMergeQueryStatesFn, defaultMergeMutationStatesFn } from './utils';

const useAsync = ({
  queries = {},
  mutations = {},
  mergeQueryStatesFn = defaultMergeQueryStatesFn,
  mergeMutationStatesFn = defaultMergeMutationStatesFn
}) => {
  const queryState = mergeQueryStatesFn(queries) as any;
  const mutationState = mergeMutationStatesFn(mutations) as any;

  return [queryState, mutationState];
};

export default useAsync;
