import {
  LOG_IN, LOAD_USERS, LOAD_MESSAGES, ADD_MESSAGE, REFRESH_INTERLOCUTOR
} from './action-types';
import axios from 'axios';

export const login = (user) => ({ type: LOG_IN, user });
export const loadUsers = (users) => ({ type: LOAD_USERS, users });
export const loadMessages = (messages) => ({ type: LOAD_MESSAGES, messages });
export const addMessage = (message) => ({ type: ADD_MESSAGE, message });
export const refreshInterlocutor = (name, id) => ({ type: REFRESH_INTERLOCUTOR, name, id });

const headers = {
  'Content-Type': 'application/json',
};

export const sendDialogue = (dial) => async () => {
  try {
    await axios.put(`${process.env.REACT_APP_SERVER_HOST}/send-dialogue`, dial, headers);
    const messagesUl = document.getElementById('messages');
    messagesUl.scrollTop = messagesUl.scrollHeight;
  } catch {
    alert('Message NOT sent!');
  }
};

export const deleteMessage = (id, str, newMessages) => async (dispatch) => {
    await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/delete-message/${id}/${str}`);
    dispatch({type: LOAD_MESSAGES, messages: newMessages})
};

export const editDialogue = (dial, newMessages) => async (dispatch) => {
  try {
    await axios.put(`${process.env.REACT_APP_SERVER_HOST}/edit-dialogue`, dial, headers);
    dispatch({type: LOAD_MESSAGES, messages: newMessages});
  } catch {
    alert('An error occurred!');
  }
};
