import {
  LOG_IN, LOAD_USERS, LOAD_MESSAGES, ADD_MESSAGE, REFRESH_INTERLOCUTOR,
} from './action-types';

const initialState = {
  users: [],
  isLogged: false,
  loggedInUserName: '',
  loggedInUser: {},
  messages: [],
  interlocutorName: '',
  interlocutorID: '',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        isLogged: true,
        loggedInUser: action.user,
        loggedInUserName: action.user.name,
      };
    case LOAD_USERS:
      return {
        ...state,
        users: action.users,
      };
    case LOAD_MESSAGES:
      return {
        ...state,
        messages: [].concat(action.messages),
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: state.messages.concat(action.message),
      };
    case REFRESH_INTERLOCUTOR:
      return {
        ...state,
        interlocutorName: action.name,
        interlocutorID: action.id,
      };
    default:
      return state;
  }
}

export default reducer;
