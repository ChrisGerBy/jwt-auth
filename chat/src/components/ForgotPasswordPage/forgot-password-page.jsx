import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const ForgotPassword = {
  maxWidth: '320px',
  margin: 'auto',
};

const InputStyle = {
  width: '100%',
  padding: '10px 15px',
  margin: '10px auto',
  boxSizing: 'border-box',
};

const SendButton = {
  width: '100%',
  boxSizing: 'border-box',
};


class ForgotPasswordPage extends Component {
    state = {
      email: '',
    };

  restorePassword(e) {
    e.preventDefault();
    const { email } = this.state;
    axios.get(`${process.env.REACT_APP_SERVER_HOST}/find-user/${email}`)
      .then((res) => {
        if (res.data) {
          alert('Password sent!');
          this.props.history.push('/login');
        }
      })
      .catch(() => {
        alert('Your e-mail not found! Please, sign up.');
        this.props.history.push('/signup');
      });
  }


  render() {
    return (
      <div style={ForgotPassword}>
        <h1>Forgot password?</h1>
        <form onSubmit={(e) => this.restorePassword(e)}>
          <input
            type="email"
            placeholder="Enter your email"
            style={InputStyle}
            onChange={(e) => this.setState({ email: e.target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={SendButton}
          >
            Send password to e-mail
          </Button>
        </form>
      </div>
    );
  }
}

export default ForgotPasswordPage;
