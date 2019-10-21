import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const LoginPageStyle = {
  maxWidth: '320px',
  margin: 'auto',
};


const InputStyle = {
  width: '100%',
  padding: '10px 15px',
  margin: '5px auto',
  boxSizing: 'border-box',
};

const ForgetPasswordStyle = {
  textAlign: 'right',
  margin: '10px auto',
};


class Login extends Component {
  state = {
    email: '',
    password: ''
  };

  onLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const { login, history } = this.props;
    const obj = JSON.stringify({
      email: email,
      password: password,
    });
    const headers = {
      'content-type': 'application/json',
    };
    axios.post(`${process.env.REACT_APP_SERVER_HOST}/signin`, obj, {
      headers: headers
    })
      .then(res => {
        if (res.status === 200){
          login(res.data);
          history.push('/chat');
        }
      })
      .catch(() => alert('Incorrect login or password!'))
  };

  render() {
    return (
      <div style={LoginPageStyle}>
        <h1>Login</h1>
        <form onSubmit={(e) => this.onLogin(e)}>
            <input
              type="email"
              placeholder="Введите email"
              style={InputStyle}
              onChange={(e) => this.setState({ email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Введите пароль"
              style={InputStyle}
              onChange={(e) => this.setState({ password: e.target.value})}
            />
          <Button
            type="submit"
            placeholder="Введите пароль"
            style={InputStyle}
            variant="contained" color="primary"
            >
            Войти
          </Button>
        </form>
        <div style={ForgetPasswordStyle}>
          <Button variant="outlined" size="small" color="primary"
                  onClick={() => this.props.history.push('/forgot-password')}
          >
            Забыли пароль?
          </Button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loggedInUserName: PropTypes.string,
  isLogged: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
};

export default Login;
