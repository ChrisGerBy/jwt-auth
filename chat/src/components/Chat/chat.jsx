import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Button from '@material-ui/core/Button';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import styled from 'styled-components';
import LoggedInUser from '../LoggedInUser';
import Users from '../Users';

const ChatStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  gridColumnGap: '20px',
  maxWidth: '700px',
  margin: '50px auto',
  position: 'relative',
  height: '500px',
};

const MessageForm = {
  position: 'absolute',
  bottom: '0',
  width: '500px',
  boxSizing: 'border-box',
};

const MessagesUl = {
  width: '500px',
  listStyleType: 'none',
  margin: '0px',
  padding: '0px',
  height: '350px',
  overflowY: 'scroll',
};

const InputStyle = {
  width: '100%',
  padding: '10px 15px',
  boxSizing: 'border-box',
  marginTop: '5px',
};

const DIV = styled.div`
 color: #FF0000;
`;
const TEXTAREA = styled.textarea`
  width: 100%;
  margin-top: 15px;
  resize: none;
  padding: 10px;
  box-sizing: border-box;
`;

const connection = new WebSocket('ws://localhost:8080');

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      editMessageID: '',
      editedMessage: '',
    };
    connection.onopen = () => { console.log('connected'); };
    connection.onclose = () => { console.error('disconnected'); };
    connection.onerror = () => { console.error('failed to connect'); };
  }

  checkMessage(message) {
    const reg = /<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
    let tagsInMessage = message.match(reg);
    let userMessage = message;
    while (tagsInMessage) {
      userMessage = userMessage.replace(tagsInMessage[0], ' ');
      tagsInMessage = userMessage.match(reg);
    }
    return userMessage.trim();
  }

  checkUserAndMessage(name, message, time) {
    if (name) {
      const messageWithoutCode = this.checkMessage(message);
      this.sendDialogue(name, messageWithoutCode, time);
    } else {
      alert('Please, log in.');
    }
  }

  sendDialogue(name, message, time) {
    const {
      addMessage, interlocutorID, interlocutorName, messages, sendDialogue,
    } = this.props;
    const newMessage = {
      id: uuid(),
      user: name,
      message,
      time,
    };

    connection.onmessage = (event) => {
      const messageObj = JSON.parse(event.data);
      addMessage({
        id: messageObj.id,
        user: messageObj.user,
        message: messageObj.message,
        time: messageObj.time,
      });
    };

    connection.send(JSON.stringify(newMessage));

    // send message to DB
    const { loggedInUserName, loggedInUser } = this.props;
    const dial = {
      id: uuid(),
      fromName: loggedInUserName,
      fromID: loggedInUser.id,
      toName: interlocutorName,
      toID: interlocutorID,
      newMessage,
      messages,
    };
    sendDialogue(dial);
    this.setState({ message: '' });
  }

  deleteMessage(id) {
    const {
      interlocutorID, loggedInUser, messages, deleteMessage,
    } = this.props;
    const newMessages = messages.filter((mess) => mess.id !== id);
    const dial = {
      fromID: loggedInUser.id,
      toID: interlocutorID,
    };
    const str = JSON.stringify(dial);
    deleteMessage(id, str, newMessages);
  }

  editMessage(id) {
    const {
      interlocutorID, loggedInUser, messages, editDialogue,
    } = this.props;
    const { editedMessage } = this.state;
    const index = messages.findIndex((mess) => mess.id === id);
    const newMessage = messages[index];
    const newMessages = messages.concat();

    const messageWithoutCode = this.checkMessage(editedMessage);

    newMessage.message = messageWithoutCode;
    newMessages.splice(index, 1, newMessage);
    const dial = {
      fromID: loggedInUser.id,
      toID: interlocutorID,
      newMessage,
      messages,
    };
    editDialogue(dial, newMessages);
    this.setState({
      editMessageID: '',
      editedMessage: '',
    });
  }


  render() {
    const { messages, loggedInUserName, interlocutorID } = this.props;
    const {
      editMessageID, editedMessage, message,
    } = this.state;

    let messagesField;
    if (interlocutorID) {
      messagesField = messages.map((message) => {
        if (message.id !== editMessageID) {
          return (
            <div className="message" key={message.id}>
              <div>
                <span className="user-name">
                  {message.user}
                :
                  {' '}
                </span>
                <span>{message.message}</span>
              </div>
              <EditOutlinedIcon
                fontSize="small"
                onClick={() => this.setState({
                  editMessageID: message.id,
                  editedMessage: message.message,
                })}
              />
              <DeleteOutlineOutlinedIcon
                fontSize="small"
                onClick={() => this.deleteMessage(message.id)}
              />
              <div className="time">{message.time}</div>
            </div>
          );
        }

        return (
          <div className="message" key={message.id}>
            <div>
              <span className="user-name">
                {message.user}
              :
                {' '}
              </span>
              <input
                type="text"
                value={editedMessage}
                onChange={(e) => this.setState({ editedMessage: e.target.value })}
              />
              <button type="button" onClick={() => this.editMessage(message.id)}>
                Edit
              </button>
            </div>
            <EditOutlinedIcon
              fontSize="small"
              onClick={() => this.editMessage(message.id, message.message)}
            />
            <DeleteOutlineOutlinedIcon
              fontSize="small"
              onClick={() => this.deleteMessage(message.id)}
            />
            <div className="time">{message.time}</div>
          </div>
        );
      });
    } else {
      messagesField = <DIV>Выберите собеседника!</DIV>;
    }
    return (
      <div>
        <h1>Chat</h1>
        <LoggedInUser />
        <div style={ChatStyle}>
          <Users />
          <div id="chat">
            <div id="messages" style={MessagesUl}>
              {messagesField}
            </div>
            <form style={MessageForm} onSubmit={(e) => e.preventDefault()}>
              <TEXTAREA
                id="message"
                value={message}
                placeholder="Type your message"
                pattern="[a-zA-Z0-9]+"
                rows="5"
                onChange={(e) => (this.setState({
                  message: e.target.value,
                }))}
              />
              <Button
                type="button"
                style={InputStyle}
                variant="contained"
                color="primary"
                onClick={() => this.checkUserAndMessage(
                  loggedInUserName,
                  message,
                  new Date().toLocaleTimeString(),
                )}
              >
              Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  loggedInUserName: PropTypes.string,
  interlocutorName: PropTypes.string,
  interlocutorID: PropTypes.string,
  loggedInUser: PropTypes.object,
  messages: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])).isRequired,
  addMessage: PropTypes.func.isRequired,
  sendDialogue: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  editDialogue: PropTypes.func.isRequired,
};

export default Chat;
