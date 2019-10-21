import { connect } from 'react-redux';
import Login from './login';
import { login } from '../../redux/actions';

const mapStatesToProps = (state) => ({
  loggedInUserName: state.name,
  isLogged: state.isLogged,
});

export default connect(mapStatesToProps, { login })(Login);
