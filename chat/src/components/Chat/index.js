import { connect } from 'react-redux';
import Chat from './chat';
import { addMessage, sendDialogue, deleteMessage, editDialogue } from '../../redux/actions';

const mapStatesToProps = (state) => ({
  loggedInUserName: state.loggedInUserName,
  loggedInUser: state.loggedInUser,
  isLogged: state.isLogged,
  messages: state.messages,
  interlocutorID: state.interlocutorID,
  interlocutorName: state.interlocutorName,
});

export default connect(mapStatesToProps, {
  addMessage, sendDialogue, deleteMessage, editDialogue })(Chat);
