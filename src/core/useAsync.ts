import { useAsyncContext } from './AsyncProvider';
import { RQMergeStatesFn } from './utils';
import { UseAsyncProps } from './types';

const useAsync = (props: UseAsyncProps = {}) => {
  const config = useAsyncContext();

  const queries = props.queries || config.queries || {};
  const mutations = props.mutations || config.mutations || {};

  const mergeQueryStatesFn =
    props.mergeQueryStatesFn || config.mergeQueryStatesFn || RQMergeStatesFn;

  const mergeMutationStatesFn =
    props.mergeMutationStatesFn || config.mergeMutationStatesfn || RQMergeStatesFn;

  const queryState = mergeQueryStatesFn(queries);
  const mutationState = mergeMutationStatesFn(mutations);

  return [queryState, mutationState];
};

export default useAsync;
