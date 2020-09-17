export const lastMessageReducer = (state, action) => {
  switch(action.type) {
    case "ADD_MESSAGE":
      return {
        count: {
          ...state.count,
          [action.payload.id]: (state.count[action.payload.id] ? (state.count[action.payload.id] + 1) : 1)
        },
        message: {
          ...state.message,
          [action.payload.id]: action.payload.message
        }
      };
    case "ADD_MESSAGE_WITHOUT_COUNT":
      return {
        count: {
          ...state.count
        },
        message: {
          ...state.message,
          [action.payload.id]: action.payload.message
        }
      };
    case "CLEAR_COUNT":
      return {
        message: {
          ...state.message,
        },
        count: {
          ...state.count,
          [action.payload.id]: 0
        }
      };
    case "CLEAR_STATE":
      return {
        count: {
          ...state.count,
          [action.payload.id]: 0
        },
        message: {
          ...state.message,
          [action.payload.id]: null
        },
      };
    default:
      throw new Error();
  }
};