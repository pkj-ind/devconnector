import React,{Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {logout} from '../../actions/auth'
const Navbar = (props) =>{
const authLinks=(<ul>
  <li>
    <Link to="/dashboard">
      <i className='fas fa-user'/>{' '}
      Dashboard</Link>
  </li>
  <li>
   <Link to="/login" onClick={props.logout}>Logout</Link>
  </li>
</ul>
);

const guestLinks=(<ul>
        <li>
            <Link to="#!">Developers</Link>
        </li>
        <li>
            <Link to="/register">Register</Link>
            </li>
        <li>
            <Link to="/login">Login</Link>
            </li>
      </ul>);

    return (
        <div>
        <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
        <i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      {!props.auth.loading && (<Fragment>{props.auth.isAuthenticated ? authLinks : guestLinks}</Fragment>)}
    </nav>
        </div>
    )
}

Navbar.propTypes={
  logout:propTypes.func.isRequired,
  auth:propTypes.object.isRequired
}
const mapStateProps = state => {
  return { auth:state.auth}
}

export default connect(mapStateProps,{logout})(Navbar)