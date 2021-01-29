export const RQ_LOADING = {
  isLoading: true,
  isFetching: false,
  hasError: false,
  hasData: false,
  status: 'loading'
};

export const RQ_LOADING_AND_FETCHING = {
  isLoading: true,
  isFetching: true,
  hasError: false,
  hasData: false,
  status: 'loading'
};

export const RQ_FETCHING = {
  isLoading: false,
  isFetching: true,
  hasError: false,
  hasData: false,
  status: 'success'
};

export const RQ_ERROR = {
  isLoading: false,
  isFetching: false,
  hasError: true,
  hasData: false,
  status: 'error'
};

export const RQ_SUCCESS = {
  isLoading: false,
  isFetching: false,
  hasError: false,
  hasData: true,
  status: 'success'
};
