import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route, Switch, Link,
} from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Chat from './components/Chat';
import ForgotPasswordPage from './components/ForgotPasswordPage';

const LinkStyle = {
  display: 'inline-block',
  padding: '5px 10px',
};

const AppStyle = {
  textAlign: 'center',
  margin: '30px auto',
};

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App" style={AppStyle}>
          <Link to="/login" style={LinkStyle}>Login</Link>
          <Link to="/signup" style={LinkStyle}>Sign up</Link>
          <Link to="/chat" style={LinkStyle}>Chat</Link>
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/chat" component={Chat} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
