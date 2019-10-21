import { connect } from 'react-redux';
import Users from './users';
import { loadUsers, loadMessages, refreshInterlocutor } from '../../redux/actions';

const mapStatesToProps = (state) => ({
  users: state.users,
  isLogged: state.isLogged,
  loggedInUserName: state.loggedInUserName,
  loggedInUser: state.loggedInUser,
});

export default connect(mapStatesToProps, { loadUsers, loadMessages, refreshInterlocutor })(Users);
