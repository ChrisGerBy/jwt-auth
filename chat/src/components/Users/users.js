import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const UsersUl = {
  listStyleType: 'none',
  margin: '0',
  padding: '0',
};

const Li = styled.li`
  text-align: left;
  padding: 10px 15px;
  border: 1px solid #CFCFCF;
  margin: 5px auto;
  &:hover {
    cursor: pointer;
    color: #0020A0;
  }
}`;

class Users extends Component {
  state = {
    selected: '',
  };

  componentDidMount() {
    const { isLogged, loggedInUserName } = this.props;
    const { loadUsers } = this.props;
    axios.get(`${process.env.REACT_APP_SERVER_HOST}/users`)
      .then((res) => {
        if (isLogged) {
          axios.post(`${process.env.REACT_APP_SERVER_HOST}/find-user`, { name: loggedInUserName })
            .then((user) => {
              const users = res.data;
              const index = users.findIndex((obj) => obj.id === user.data.id);
              const before = users.slice(0, index);
              const after = users.slice(index + 1);
              loadUsers(before.concat(after));
            });
        } else {
          loadUsers(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  onChooseDialog(name, id) {
    const {
      loggedInUserName, loggedInUser, loadMessages, refreshInterlocutor,
    } = this.props;
    refreshInterlocutor(name, id);
    const dialogue = {
      fromName: loggedInUserName,
      fromID: loggedInUser.id,
      toName: name,
      toID: id,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    axios.post(`${process.env.REACT_APP_SERVER_HOST}/find-dialogue`, dialogue, headers)
      .then((res) => {
        if (!res.data) {
          axios.post(`${process.env.REACT_APP_SERVER_HOST}/create-dialogue`, dialogue, headers)
            .then(() => {
              loadMessages([]);
            });
        } else {
          axios.post(`${process.env.REACT_APP_SERVER_HOST}/load-dialogue`, dialogue, headers)
            .then((dataLoad) => {
              loadMessages(dataLoad.data.messages);
            });
        }
      });
  }

  render() {
    const { users } = this.props;
    const list = users.map((user) => (

      <Li
        key={user.id}
        className={(user.id === this.state.selected) ? 'active-user' : 'null'}
        onClick={() => {
          this.setState({selected: user.id,});
          this.onChooseDialog(user.name, user.id);
        }}
      >
        {user.name}
      </Li>
    ));
    return (
      <div>
        <ul style={UsersUl}>{list}</ul>
      </div>
    );
  }
}

Users.propTypes = {
  users: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])).isRequired,
  loadUsers: PropTypes.func.isRequired,
  loadMessages: PropTypes.func.isRequired,
  refreshInterlocutor: PropTypes.func.isRequired,
  isLogged: PropTypes.bool.isRequired,
  loggedInUserName: PropTypes.string,
  loggedInUser: PropTypes.object,
};


export default Users;
