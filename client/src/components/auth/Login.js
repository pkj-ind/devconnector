import React,{Fragment, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
//import { useDispatch } from 'react-redux'
//import {setAlert} from '../../actions/alert'
import {login} from '../../actions/auth'
import PropTypes from 'prop-types'


const Login = ({login}) =>{
    const [formData, setFormData]=useState({
        email:'',
        password:''
    });
    const {email,password}=formData;
   
    const onChange = e => setFormData({...formData,[e.target.name]:e.target.value})

    const onSubmit = async e =>{
        e.preventDefault();
        login(email,password)

            try {
                //since we are sending data create config and define header type
                const config={
                    headers:{
                        'Content-Type':'application/json'
                    }
                };
                const body=JSON.stringify(login)
                const res = await axios.post('/api/auth',body,config);

                console.log(res.data)
            } catch (error) {
                console.error(error.response.data)
            }
        
        
    }
    return (
        <Fragment>
       <h1 className="large text-primary">Login</h1>
      <p className="lead"><i className="fas fa-user"></i> Login into Your Account</p>
      <form className="form" onSubmit={e => {onSubmit(e)}}>
        
        <div className="form-group">
          <input type="email" placeholder="Email Address" 
          name="email"
          value={email} 
          onChange={e=>onChange(e)}
          />
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
        
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Do not have an account? <Link to="/register">Sign Up</Link>
      </p>
        </Fragment>
    )
}
Login.prototype={
  login:PropTypes.func.isRequired
}
export default connect(null,{login})(Login)