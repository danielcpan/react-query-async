import { RQMergeStatesFn } from './utils';

const useAsync = ({
  queries = {},
  mutations = {},
  mergeQueryStatesFn = RQMergeStatesFn,
  mergeMutationStatesFn = RQMergeStatesFn
}) => {
  const queryState = mergeQueryStatesFn(queries) as any;
  const mutationState = mergeMutationStatesFn(mutations) as any;

  return [queryState, mutationState];
};

export default useAsync;
