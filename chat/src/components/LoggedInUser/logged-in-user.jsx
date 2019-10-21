import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LoggedInUser extends Component {
  render() {
    const { isLogged, loggedInUserName } = this.props;
    if (isLogged) {
      return (
        <div>
          <p>
            You are logged in as: {loggedInUserName}
          </p>
        </div>
      );
    }
    return (
      <div>You are not logged in.</div>
    );
  }
}

LoggedInUser.propTypes = {
  loggedInUserName: PropTypes.string,
  isLogged: PropTypes.bool.isRequired,
};

export default LoggedInUser;
