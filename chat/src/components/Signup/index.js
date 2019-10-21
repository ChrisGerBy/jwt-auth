import { connect } from 'react-redux';
import Signup from './signup';
import { login } from '../../redux/actions';

const mapStatesToProps = (state) => ({
  loggedInUser: state.loggedInUser,
  loggedInUserName: state.loggedInUserName,
  isLogged: state.isLogged,
});

export default connect(mapStatesToProps, { login })(Signup);
