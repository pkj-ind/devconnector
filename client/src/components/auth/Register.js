import React,{Fragment, useState} from 'react';
//import axios from 'axios'
import {Link,Redirect} from 'react-router-dom'
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux'
import {setAlert} from '../../actions/alert'
import {register} from '../../actions/auth'
import PropTypes from 'prop-types'
//import store from '../../store';


const Register = ({isAuthenticated}) =>{
    const [formData, setFormData]=useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });
    const {name,email,password,password2}=formData;
    const dispatch = useDispatch()
    const onChange = e => setFormData({...formData,[e.target.name]:e.target.value})

    const onSubmit = async e =>{
        e.preventDefault();
        if (password !== password2){
            //console.log('Password do not match')
            dispatch(setAlert('Passwords do not match!', 'danger'))
        } else {
          console.log(name,email,password)
            dispatch(register({name,email,password}));
        }       
    }
    //Redirect if Registered successfully
   /* const currstate = store.getState()
    console.log(currstate)
    if(currstate.auth.isAuthenticated){
      return <Redirect to='/dashboard' />
    }*/
    if(isAuthenticated){
      return <Redirect to='/dashboard' />
    }


    return (
        <Fragment>
       <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => {onSubmit(e)}}>
        <div className="form-group">
          <input type="text" placeholder="Name" 
          name="name" 
          value={name} 
          onChange={e=>onChange(e)}
          required
           />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" 
          name="email"
          value={email} 
          onChange={e=>onChange(e)}
          />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} 
          onChange={e=>onChange(e)}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e=>onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
        </Fragment>
    )
}

Register.prototype={
  setAlert:PropTypes.func.isRequired,
  register:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

// this will allow us to access props.setAlert
//export default connect(null,setAlert) (Register) 
export default connect(mapStateToProps)(Register)