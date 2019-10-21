import { connect } from 'react-redux';
import LoggedInUser from './logged-in-user';

const mapStatesToProps = (state) => ({
  loggedInUserName: state.loggedInUserName,
  isLogged: state.isLogged,
});

export default connect(mapStatesToProps)(LoggedInUser);
