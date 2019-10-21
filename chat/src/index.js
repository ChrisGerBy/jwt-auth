import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { bindActionCreators, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import App from './App';
import * as actions from './redux/actions';
import reducer from './redux/reducer';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const { dispatch } = store;
const {
  login, loadUsers, loadMessages, addMessage, refreshInterlocutor,
} = bindActionCreators(actions, dispatch);

ReactDOM.render(
  <Provider store={store}>
    <App
      login={(name) => login(name)}
      loadUsers={(users) => loadUsers(users)}
      loadMessages={(messages) => loadMessages(messages)}
      addMessage={(message) => addMessage(message)}
      refreshInterlocutor={(name,id) => refreshInterlocutor(name, id)}
    />
  </Provider>,
  document.getElementById('root'),
);
