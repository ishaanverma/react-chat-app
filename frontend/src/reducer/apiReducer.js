export const apiReducer = (state, action) => {
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
    default:
      throw new Error();
  }
};