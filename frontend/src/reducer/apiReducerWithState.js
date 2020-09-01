export const apiReducerWithState = (state, action) => {
  switch(action.type) {
    case "API_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "API_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "API_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "APPEND_TO_STATE":
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    default:
      throw new Error();
  }
};