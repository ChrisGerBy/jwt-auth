import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Button from '@material-ui/core/Button';

const SignUpForm = {
  maxWidth: '320px',
  margin: 'auto',
};

const SignUpInput = {
  width: '100%',
  padding: '10px 15px',
  margin: '5px',
  boxSizing: 'border-box',
};

class Signup extends Component {
  state = {
      name: '',
      birthday: '',
      email: '',
      password: '',
      errors: {
        email: '',
        password: '',
      }
    };

  createUser(e) {
    e.preventDefault();
    const newUser = this.state;
    newUser['id'] = uuid();
    const headers = {
      'content-type': 'application/json',
    };
    axios.post(`${process.env.REACT_APP_SERVER_HOST}/create-user`, newUser, {
      headers: headers
    }).then((res) => {
      this.props.login(res.data);
      this.props.history.push('/chat');
      alert('Account created!');
    }).catch(err => {
      err.response.data.errors.forEach((err) => {
        if (err.param === "email") {
          this.setState({
            errors: { email: err.msg,}
          });
          alert (err.msg);
        }

        if (err.param === "password") {
          this.setState({
            errors: { password: err.msg,}
          });
          alert (err.msg);
        }
      });
    })
  }


  render() {
      return (
        <div className='signup'>
          <h1>Sign up</h1>
          <form style={SignUpForm} onSubmit={(e) => this.createUser(e)}>
            <input type="text" style={SignUpInput} placeholder="Введите ФИО"
                   onChange={(e) => {
                     this.setState({name: e.target.value})
                   }}
                   required
            />
            <input type="date" style={SignUpInput} placeholder="Введите дату рождения"
                   onChange={(e) => {
                     this.setState({birthday: e.target.value})
                   }}/>
            <input type="email" style={SignUpInput} placeholder="Введите e-mail"
                   onChange={(e) => {
                     this.setState({email: e.target.value})
                   }}
                   className={this.state.errors.email ? 'bad-input' : 'null'}
                   required
            />
            <input type="password" style={SignUpInput} placeholder="Введите пароль"
                   onChange={(e) => {
                     this.setState({password: e.target.value})
                   }}
                   className={this.state.errors.password ? 'bad-input' : 'null'}
                   required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={SignUpInput}
            >
              Создать аккаунт
            </Button>
          </form>
        </div>
      );
  }
};

Signup.propTypes = {
  name: PropTypes.string,
  isLogged: PropTypes.bool,
};


export default Signup;