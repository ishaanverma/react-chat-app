import { produce } from 'immer';

export const messagesReducer = produce((draftState, action) => {
  switch(action.type) {
    case "API_FETCH_INIT":
      draftState.isLoading = true;
      draftState.isError = false;
      return;
    case "API_FETCH_SUCCESS":
      draftState.isLoading = false;
      draftState.isError = false;
      draftState.offset = action.payload.offset;
      let tempData = [...action.payload.data].reverse(); 
      draftState.data.unshift(...tempData);
      draftState.count = action.payload.count;
      return;
    case "API_FETCH_FAILURE":
      draftState.isLoading = false;
      draftState.isError = true;
      return;
    case "APPEND_TO_STATE":
      draftState.data.push(action.payload.data);
      return;
    case "NEW_CHAT":
      return {
        data: [],
        isLoading: false,
        isError: false,
        offset: 0,
        limit: 12,
        count: 0
      }
    default:
      throw new Error();
  }
});