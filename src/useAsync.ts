import { RQMergeStatesFn } from './utils';
import { UseAsyncProps } from './types';

const useAsync = ({
  queries = {},
  mutations = {},
  mergeQueryStatesFn = RQMergeStatesFn,
  mergeMutationStatesFn = RQMergeStatesFn
}: UseAsyncProps) => {
  const queryState = mergeQueryStatesFn(queries);
  const mutationState = mergeMutationStatesFn(mutations);

  return [queryState, mutationState];
};

export default useAsync;
